import SectionHeading from "./section-heading";
import { skillCategories } from "../constants";
import type { Translations } from "../i18n/translations";

type Props = { t: Translations["skills"] };

export default function Skills({ t }: Props) {
  return (
    <section id="skills" className="py-28 bg-ctp-base">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="mt-16 flex flex-col gap-10">
          {skillCategories.map((category) => (
            <div key={category.label} className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-ctp-overlay1">
                {category.label}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="rounded-lg px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: `${skill.color}12`,
                      color:           skill.color,
                      border:          `1px solid ${skill.color}30`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
