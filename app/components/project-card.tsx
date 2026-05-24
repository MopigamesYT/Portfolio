import { ExternalLinkIcon, GitHubIcon, StarIcon } from "./icons";
import type { GithubRepo } from "../lib/github";
import { portfolio } from "../constants";
import ctp from "../lib/ctp";

export default function ProjectCard({
  repo,
  index = 0,
  animate = false,
}: {
  repo:     GithubRepo;
  index?:   number;
  animate?: boolean;
}) {
  const accent = repo.language?.color ?? ctp.mauve;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01]"
      style={{
        backgroundColor: ctp.surface0,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accent}22`,
        ...(animate && {
          animation:      "fade-up 0.4s ease forwards",
          animationDelay: `${index * 80}ms`,
          opacity:        0,
        }),
      }}
    >
      {/* accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-1 transition-all duration-300 group-hover:w-1.5"
        style={{ background: `linear-gradient(180deg, ${accent}, ${accent}88)` }}
      />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-ctp-text">
            {repo.owner !== portfolio.githubUsername && (
              <span style={{ color: ctp.overlay1 }}>{repo.owner}/</span>
            )}
            {repo.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5">
            {repo.homepageUrl && (
              <a
                href={repo.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-1.5 text-ctp-overlay1 transition-all hover:bg-ctp-surface1 hover:text-ctp-text"
                aria-label={`View ${repo.name} live`}
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            )}
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-ctp-overlay1 transition-all hover:bg-ctp-surface1 hover:text-ctp-text"
              aria-label={`${repo.name} on GitHub`}
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-ctp-subtext0">
          {repo.description ?? "No description."}
        </p>

        <div className="flex flex-wrap items-end justify-between gap-3">
          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: `${accent}18`,
                    color:           accent,
                    border:          `1px solid ${accent}40`,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-3 text-xs text-ctp-overlay1">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: accent, boxShadow: `0 0 0 2px ${accent}40` }}
                />
                {repo.language.name}
              </span>
            )}
            {repo.starCount > 0 && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ backgroundColor: `${ctp.yellow}15`, color: ctp.yellow }}
              >
                <StarIcon className="h-3.5 w-3.5" />
                {repo.starCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
