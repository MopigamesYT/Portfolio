"use client";

import { useState } from "react";
import ProjectCard from "./project-card";
import { ChevronDownIcon } from "./icons";
import type { GithubRepo } from "../lib/github";

type Props = {
  pinned:        GithubRepo[];
  more:          GithubRepo[];
  showMoreLabel: string;
  showLessLabel: string;
};

export default function ProjectGrid({ pinned, more, showMoreLabel, showLessLabel }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pinned.map((repo) => (
          <ProjectCard key={`${repo.owner}/${repo.name}`} repo={repo} />
        ))}
      </div>

      {more.length > 0 && (
        <>
          {expanded && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.map((repo, i) => (
                <ProjectCard key={`${repo.owner}/${repo.name}`} repo={repo} index={i} animate />
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-ctp-surface2 bg-ctp-surface0 px-5 py-2.5 text-sm font-medium text-ctp-subtext1 transition-all duration-200 hover:-translate-y-0.5 hover:border-ctp-mauve/50 hover:text-ctp-text"
            >
              {expanded ? showLessLabel : `${showMoreLabel} (${more.length})`}
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
