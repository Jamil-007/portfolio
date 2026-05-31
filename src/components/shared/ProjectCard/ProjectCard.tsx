"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github, ImageIcon } from "lucide-react";
import { formatLabel } from "@/lib/analytics";
import type { Project, ProjectType } from "@/lib/types";

export function ProjectCard({ project, projectTypes }: { project: Project; projectTypes?: ProjectType[] }) {
  const typeLabel = projectTypes ? lookupLabel(projectTypes, project.type) : formatLabel(project.type);

  return (
    <article className="group flex flex-col">
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden rounded-lg bg-paper ring-1 ring-[rgba(23,23,23,0.08)] transition-shadow hover:ring-ink/30"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={`${project.title} preview`}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#fbf8f2,#f5f1ea)]">
              <ImageIcon size={32} className="text-quiet" />
            </div>
          )}
          <div className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-cream opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <span className="mono-label text-quiet">{typeLabel}</span>
        <h3 className="serif-display mt-2 text-[28px] leading-[1.02] text-ink transition-colors group-hover:text-accent">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted line-clamp-3">{project.shortDescription}</p>
        {project.technologies.length ? (
          <div className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-tight text-muted">
            {project.technologies.slice(0, 5).map((tech, i) => (
              <span key={tech} className="inline-flex items-center gap-2">
                {i > 0 ? <span className="text-quiet">/</span> : null}
                <span>{tech}</span>
              </span>
            ))}
          </div>
        ) : null}
        {project.liveUrl || project.repositoryUrl ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-ink px-3 py-1.5 text-[11px] font-medium text-cream transition hover:bg-accent hover:border-accent"
              >
                <ExternalLink size={12} /> Live
              </a>
            ) : null}
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(23,23,23,0.18)] px-3 py-1.5 text-[11px] font-medium text-ink transition hover:border-ink"
              >
                <Github size={12} /> Repo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function lookupLabel(projectTypes: ProjectType[], value: string) {
  return projectTypes.find((type) => type.id === value)?.label ?? formatLabel(value);
}
