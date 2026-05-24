"use client";

import { useEffect, useState } from "react";
import ctp from "../lib/ctp";

export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-8 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 lg:flex"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <span className="text-xs" style={{ color: ctp.overlay0 }}>scroll</span>
      <div className="h-5 w-px animate-bounce" style={{ backgroundColor: ctp.overlay0 }} />
    </div>
  );
}
