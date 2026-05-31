"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github, ImageIcon } from "lucide-react";
import type { Project } from "@/lib/types";
import { useReveal } from "@/components/home/UseReveal/useReveal";

export function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  const reverse = index % 2 === 1;
  const detailHref = `/projects/${project.slug}`;

  return (
    <article
      ref={ref}
      className={`group relative pb-10 transition-all duration-700 sm:pb-14 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="grid items-center gap-6 sm:gap-10 md:grid-cols-12">
        <Link
          href={detailHref}
          aria-label={`View ${project.title}`}
          className={`block md:col-span-7 ${reverse ? "md:order-2" : ""}`}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-paper">
            {project.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImage}
                alt={`${project.title} preview`}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#fbf8f2,#f5f1ea)]">
                <ImageIcon size={42} className="text-quiet" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="rounded-full bg-ink/80 px-2.5 py-1 backdrop-blur-sm">View case</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 backdrop-blur-sm">
                Open <ArrowUpRight size={11} />
              </span>
            </div>
          </div>
        </Link>
        <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""}`}>
          <Link href={detailHref} className="block">
            <h3 className="serif-display text-[clamp(2rem,5vw,3.25rem)] text-ink transition-colors group-hover:text-accent">
              {project.title}
            </h3>
          </Link>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-muted sm:text-base">
            {project.shortDescription}
          </p>
          {project.technologies.length ? (
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] tracking-tight text-muted">
              {project.technologies.slice(0, 6).map((tech, i) => (
                <span key={tech} className="inline-flex items-center gap-2">
                  {i > 0 ? <span className="text-quiet">/</span> : null}
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          ) : null}
          {project.liveUrl || project.repositoryUrl ? (
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-ink px-3.5 py-1.5 text-[12px] font-medium text-cream transition hover:bg-accent hover:border-accent"
                >
                  <ExternalLink size={12} /> Live
                </a>
              ) : null}
              {project.repositoryUrl ? (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(23,23,23,0.18)] px-3.5 py-1.5 text-[12px] font-medium text-ink transition hover:border-ink"
                >
                  <Github size={12} /> Repo
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
