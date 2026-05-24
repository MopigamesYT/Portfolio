"use client";

import { useEffect, useRef } from "react";
import ctp from "../lib/ctp";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const COLOR_LIGHT = ctp.surface0; // #313244
const COLOR_DARK  = ctp.crust;    // #11111b

// Fraction of each pair taken by the light band (rest goes to dark)
const LIGHT_RATIO = 0.76;

const NUM_PAIRS  = 10;
const AMPLITUDE  = 0.37;  // fraction of pairH - higher = more defined edges
const PERIOD_FAC = 0.58;
const SPEED_FAC  = 0.25;  // pairs per second

const ALPHA_LIGHT = 0.72;
const ALPHA_DARK  = 0.88;

export default function HeroWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let raf: number;
    let offset   = 0;
    let lastTime = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime  = now;

      const w = canvas.width;
      const h = canvas.height;

      const extent = (w + h) / (2 * Math.SQRT2) * 1.05;
      const pairH  = (extent * 2) / NUM_PAIRS;
      const lightH = pairH * LIGHT_RATIO;
      const darkH  = pairH * (1 - LIGHT_RATIO);
      const amp    = pairH * AMPLITUDE;
      const period = extent * 2 * PERIOD_FAC;

      // One pairH = one full light+dark cycle → seamless loop
      offset = (offset + pairH * SPEED_FAC * dt) % pairH;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 4);

      const xL   = -extent;
      const xR   =  extent;
      const step = Math.max(2, Math.ceil((xR - xL) / 350));

      const band = (base: number, height: number, color: string, alpha: number) => {
        ctx.beginPath();
        let first = true;
        for (let x = xL; x <= xR + step; x += step) {
          const xc = Math.min(x, xR);
          const y  = base + amp * Math.sin((xc / period) * Math.PI * 2);
          if (first) { ctx.moveTo(xc, y); first = false; }
          else        ctx.lineTo(xc, y);
        }
        for (let x = xR; x >= xL - step; x -= step) {
          const xc = Math.max(x, xL);
          ctx.lineTo(xc, base + height + amp * Math.sin((xc / period) * Math.PI * 2));
        }
        ctx.closePath();
        ctx.fillStyle = hexToRgba(color, alpha);
        ctx.fill();
      };

      for (let i = -2; i <= NUM_PAIRS + 2; i++) {
        const pairBase = -extent + i * pairH + offset;
        band(pairBase,           lightH, COLOR_LIGHT, ALPHA_LIGHT);
        band(pairBase + lightH,  darkH,  COLOR_DARK,  ALPHA_DARK);
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
