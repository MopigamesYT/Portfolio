export type Locale = "en" | "fr";

export const translations = {
  en: {
    nav: {
      links: [
        { label: "About",    href: "#about"    },
        { label: "Skills",   href: "#skills"   },
        { label: "Projects", href: "#projects" },
        { label: "Epitech",  href: "#epitech"  },
        { label: "Contact",  href: "#contact"  },
      ],
    },
    hero: {
      greeting:      "Hi, I'm",
      role:          "Software Engineering Student • Full-Stack Developer • Open Source Contributor",
      bio:           "I develop software from low-level C systems to full-stack TypeScript applications. Currently studying at Epitech Marseille, I focus on solving challenging technical problems.",
      legalNameNote: "Legal name available upon request or on academic records.",
      viewWork:      "View My Work",
      getInTouch:    "Get in Touch",
    },
    about: {
      eyebrow: "Who I Am",
      title:   "About Me",
      bio: [
        "I am a second-year software engineering student at Epitech Marseille, with practical experience across the full stack-from systems programming in C to modern web development using TypeScript, React, and Next.js.",
        "I have contributed to open-source projects, implemented CI/CD pipelines with GitHub Actions, and completed internships in PHP development and hardware refurbishment. I learn independently and take pride in understanding how technology works at a fundamental level.",
        "Outside of coding, I play piano, experiment with 3D printing, and practice urban parkour. I also have a passion for railways.",
      ],
      stats: [
        { label: "Years Experience"  },
        { label: "Epitech Projects Shipped" },
        { label: "Open Source Repos" },
        { label: "Cups of Coffee"    },
      ],
    },
    epitech: {
      eyebrow:          "Epitech",
      title:            "School Stats",
      projectsDelivered: "Projects Delivered",
      avgPassRate:      "Avg Pass Rate",
      tepitechScore:    "Tepitech Score",
      campusHours:      "Campus Hours",
      recentDeliveries: "Recent Deliveries",
      logtimeTitle:     "Logtime - Last 14 Days",
      legendYou:        "Me",
      legendPromo:      "Promo avg",
      tests:            "tests",
      noTests:          "No tests run",
    },
    skills: {
      eyebrow: "What I Know",
      title:   "Skills & Technologies",
    },
    projects: {
      eyebrow:    "What I've Built",
      title:      "Featured Projects",
      viewMore:   "View more on GitHub",
      showMore:   "Show more projects",
      showLess:   "Show less",
      noProjects: "No projects to display.",
    },
    contact: {
      eyebrow: "Say Hello",
      title:   "Get in Touch",
      body:    "I welcome discussions about projects, collaborations, or technology. Feel free to reach out.",
      cta:     "Send me a mail!",
    },
    footer: {
      builtWith: "Built with",
    },
    loader: {
      loading: "Loading...",
    },
  },

  fr: {
    nav: {
      links: [
        { label: "À propos",    href: "#about"    },
        { label: "Compétences", href: "#skills"   },
        { label: "Projets",     href: "#projects" },
        { label: "Epitech",     href: "#epitech"  },
        { label: "Contact",     href: "#contact"  },
      ],
    },
    hero: {
      greeting:      "Bonjour, je suis",
      role:          "Étudiante en ingénierie logicielle • Développeuse full-stack • Contributrice open source",
      bio:           "Je développe des logiciels, des systèmes bas niveau en C aux applications web full-stack en TypeScript. Actuellement étudiante à Epitech Marseille, je me concentre sur la résolution de problèmes techniques complexes.",
      legalNameNote: "Nom légal disponible sur demande ou sur les documents académiques.",
      viewWork:      "Voir mes projets",
      getInTouch:    "Me contacter",
    },
    about: {
      eyebrow: "Qui suis-je",
      title:   "À propos de moi",
      bio: [
        "Je suis étudiante en deuxième année à Epitech Marseille, avec une expérience pratique sur toute la pile technique, de la programmation système en C au développement web moderne avec TypeScript, React et Next.js.",
        "J'ai contribué à des projets open source, mis en place des pipelines CI/CD avec GitHub Actions et effectué des stages en développement PHP et en reconditionnement matériel. J'apprends de manière autonome et m'attache à comprendre le fonctionnement fondamental des technologies.",
        "En dehors du développement, je joue du piano, expérimente avec l'impression 3D et pratique le parkour urbain. Je suis également passionnée par le ferroviaire.",
      ],
      stats: [
        { label: "Années d'expérience" },
        { label: "Projets Epitech livrés" },
        { label: "Dépôts open source"  },
        { label: "Cafés bus"           },
      ],
    },
    epitech: {
      eyebrow:          "Epitech",
      title:            "Résultats scolaires",
      projectsDelivered: "Projets livrés",
      avgPassRate:      "Taux de réussite moy.",
      tepitechScore:    "Score Tepitech",
      campusHours:      "Heures sur campus",
      recentDeliveries: "Dernières livraisons",
      logtimeTitle:     "Logtime - 14 derniers jours",
      legendYou:        "Moi",
      legendPromo:      "Moy. de promo",
      tests:            "tests",
      noTests:          "Aucun test exécuté",
    },
    skills: {
      eyebrow: "Ce que je maîtrise",
      title:   "Compétences & Technologies",
    },
    projects: {
      eyebrow:    "Ce que j'ai construit",
      title:      "Projets phares",
      viewMore:   "Voir plus sur GitHub",
      showMore:   "Voir plus de projets",
      showLess:   "Réduire",
      noProjects: "Aucun projet à afficher.",
    },
    contact: {
      eyebrow: "Dites bonjour",
      title:   "Me contacter",
      body:    "Je suis ouverte aux échanges sur des projets, des collaborations ou des sujets techniques. N'hésitez pas à me contacter.",
      cta:     "Envoyez-moi un mail!",
    },
    footer: {
      builtWith: "Construit avec",
    },
    loader: {
      loading: "Chargement...",
    },
  },
} as const;

export type Translations = typeof translations[Locale];