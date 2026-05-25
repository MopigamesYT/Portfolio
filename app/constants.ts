// Non-translatable data - URLs, colors, tags, technical names.
// All user-facing text (labels, descriptions, bios) lives in app/i18n/translations.ts.

export const portfolio = {
  name:           "Margot PREGO",
  initials:       "MP",
  email:          "contact@mopigames.dev",
  githubUrl:      "https://github.com/MopigamesYT",
  githubUsername: "MopigamesYT",
  linkedinUrl:    "https://linkedin.com/in/m-prego",
} as const;

// When you started coding - used to auto-calculate the "years of experience" stat.
export const experienceStart = "2020-01-01";

// Stat values and accent colors - labels are in translations.ts (in the same order)
export const stats = [
  { value: "6+",  color: "#cba6f7" }, // mauve  - overridden dynamically from experienceStart
  { value: "50+", color: "#89b4fa" }, // blue
  { value: "50+", color: "#a6e3a1" }, // green
  { value: "∞",   color: "#fab387" }, // peach
] as const;

export type Skill = { name: string; color: string };
export type SkillCategory = { label: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      { name: "TypeScript", color: "#89b4fa" },
      { name: "JavaScript", color: "#f9e2af" },
      { name: "Python",     color: "#a6e3a1" },
      { name: "Rust",       color: "#fab387" },
      { name: "C",          color: "#74c7ec" },
      { name: "Java",       color: "#f38ba8" },
      { name: "PHP",        color: "#b4befe" },
      { name: "C#",         color: "#cba6f7" },
    ],
  },
  {
    label: "Frameworks & Libraries",
    skills: [
      { name: "React",        color: "#89dceb" },
      { name: "Next.js",      color: "#b4befe" },
      { name: "Node.js",      color: "#94e2d5" },
      { name: "Tailwind CSS", color: "#94e2d5" },
    ],
  },
  {
    label: "Tools & Infrastructure",
    skills: [
      { name: "Docker",         color: "#89b4fa" },
      { name: "GitHub Actions", color: "#a6e3a1" },
      { name: "Linux",          color: "#cba6f7" },
      { name: "Git",            color: "#fab387" },
    ],
  },
];

// Project titles are proper nouns; descriptions live in translations.ts (same order)
