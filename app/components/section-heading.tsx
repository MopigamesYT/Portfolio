import ctp from "../lib/ctp";

export default function SectionHeading({
  eyebrow,
  title,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${centered ? "items-center text-center" : "items-start"}`}>
      <span
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: ctp.mauve }}
      >
        {eyebrow}
      </span>
      <h2 className="text-4xl font-bold tracking-tight text-ctp-text lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}
