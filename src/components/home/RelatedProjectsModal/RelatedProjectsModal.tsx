"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/lib/types";

export function RelatedProjectsModal({
  label,
  kind,
  projects,
  onClose,
}: {
  label: string;
  kind: "tech" | "skill";
  projects: Project[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Projects using ${label}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 px-4 py-6 backdrop-blur-md sm:items-center sm:px-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-cream shadow-[0_30px_90px_rgba(0,0,0,0.35)] animate-rise-in"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-black/[0.05] hover:text-ink"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-7 sm:px-8">
          <div className="mono-label text-quiet">
            {kind === "tech" ? "Tech" : "Skill"}
            <span className="mx-2 text-quiet">/</span>
            {projects.length.toString().padStart(2, "0")} {projects.length === 1 ? "project" : "projects"}
          </div>
          <h2 className="serif-display mt-2 text-[clamp(1.75rem,4vw,2.5rem)]">{label}</h2>
        </div>

        {projects.length ? (
          <ul className="mt-5 max-h-[60vh] divide-y divide-[rgba(23,23,23,0.08)] overflow-y-auto px-3 pb-5 sm:px-5">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex items-start gap-4 rounded-lg px-3 py-3 transition hover:bg-black/[0.04]"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-xl leading-tight text-ink transition-colors group-hover:text-accent">
                      {project.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
                      {project.shortDescription}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="mt-2 shrink-0 text-quiet transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 sm:px-8">
            <p className="font-mono text-sm text-muted">
              No projects use {kind === "tech" ? "this tech" : "this skill"} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
