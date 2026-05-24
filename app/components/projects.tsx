import SectionHeading from "./section-heading";
import ProjectGrid from "./project-grid";
import { GitHubIcon, ExternalLinkIcon } from "./icons";
import { portfolio } from "../constants";
import { fetchGithubProjects } from "../lib/github";
import ctp from "../lib/ctp";
import type { Translations } from "../i18n/translations";

type Props = { t: Translations["projects"] };

export default async function Projects({ t }: Props) {
  const { pinned, recent } = await fetchGithubProjects();

  return (
    <section id="projects" className="py-28" style={{ backgroundColor: ctp.mantle }}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="mt-16">
          {pinned.length === 0 && recent.length === 0 ? (
            <p className="text-center text-sm" style={{ color: ctp.overlay0 }}>
              {t.noProjects}
            </p>
          ) : (
            <ProjectGrid
              pinned={pinned}
              more={recent}
              showMoreLabel={t.showMore}
              showLessLabel={t.showLess}
            />
          )}
        </div>

        <div className="mt-12 text-center">
          <a
            href={portfolio.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ctp-subtext1 transition-colors hover:text-ctp-mauve"
          >
            <GitHubIcon className="h-4 w-4" />
            {t.viewMore}
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
