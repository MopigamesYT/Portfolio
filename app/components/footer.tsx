import { portfolio } from "../constants";
import ctp from "../lib/ctp";
import type { Translations } from "../i18n/translations";

type Props = { t: Translations["footer"] };

export default function Footer({ t }: Props) {
  return (
    <footer
      className="border-t py-8 text-center"
      style={{ backgroundColor: ctp.crust, borderColor: ctp.surface0 }}
    >
      <p className="text-sm" style={{ color: ctp.overlay0 }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {portfolio.name} ·{" "}
        {t.builtWith}{" "}
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" style={{ color: ctp.pink }} className="transition-opacity hover:opacity-70">Next.js</a>{" "}
        &amp;{" "}
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" style={{ color: ctp.blue }} className="transition-opacity hover:opacity-70">Tailwind CSS</a>{" "}
        ·{" "}
        <a href="https://catppuccin.com" target="_blank" rel="noopener noreferrer" style={{ color: ctp.lavender }} className="transition-opacity hover:opacity-70">Catppuccin Mocha</a>
      </p>
    </footer>
  );
}
