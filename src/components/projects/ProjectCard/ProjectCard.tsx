"use client";

import { useState } from "react";
import { ExternalLink, Github, ImageIcon } from "lucide-react";
import { formatLabel } from "@/lib/analytics";
import type { PortfolioSettings, Project, SettingsOption } from "@/lib/types";
import { Badge } from "@/components/shared/Badge/Badge";

export function ProjectCard({ project, settings }: { project: Project; settings?: PortfolioSettings }) {
  const [flipped, setFlipped] = useState(false);
  const typeLabel = settings ? optionLabel(settings.projectTypes, project.type) : formatLabel(project.type);

  return (
    <article>
      <div className="group aspect-video [perspective:1200px]">
      <div
        tabIndex={0}
        aria-label={`${project.title} project card`}
        className={`relative h-full cursor-pointer rounded-lg outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2 group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
        onClick={() => setFlipped((value) => !value)}
      >
        <div className="whisper-card absolute inset-0 overflow-hidden p-0 [backface-visibility:hidden]">
          <div className="h-full w-full overflow-hidden bg-[#f2f9ff]">
            {project.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.coverImage} alt={`${project.title} preview`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#f2f9ff,#ffffff)] px-6 text-center">
                <ImageIcon size={36} className="text-[#0075de]" />
                <span className="text-sm font-semibold text-muted">Project preview coming soon</span>
              </div>
            )}
          </div>
        </div>
        <div className="whisper-card absolute inset-0 flex h-full flex-col overflow-y-auto p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="neutral">{typeLabel}</Badge>
          </div>
          <h3 className="text-[22px] font-bold leading-tight tracking-[-0.25px] text-ink">
            {project.title}
          </h3>
          <p className="mt-3 text-base leading-6 text-muted">{project.shortDescription}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.slice(0, 5).map((tech) => (
              <Badge key={tech} tone="neutral">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      </div>
      <h3 className="mt-3 text-[20px] font-bold leading-tight tracking-[-0.25px] text-ink">
        {project.title}
      </h3>
      {project.liveUrl || project.repositoryUrl ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#0075de] bg-[#0075de] px-3 text-xs font-semibold text-white transition hover:bg-[#005bab]"
              onClick={(event) => event.stopPropagation()}
            >
              <ExternalLink size={14} /> Live
            </a>
          ) : null}
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-ink transition hover:border-black/20 hover:bg-black/[0.04]"
              onClick={(event) => event.stopPropagation()}
            >
              <Github size={14} /> Repo
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function optionLabel(options: SettingsOption[], value: string) {
  return options.find((option) => option.id === value)?.label ?? formatLabel(value);
}
