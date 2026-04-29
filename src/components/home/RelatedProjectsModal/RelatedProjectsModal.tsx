"use client";

import { X } from "lucide-react";
import type { PortfolioData } from "@/lib/types";
import { ProjectCard } from "@/components/projects/ProjectCard/ProjectCard";

export function RelatedProjectsModal({
  label,
  kind,
  projects,
  settings,
  onClose,
}: {
  label: string;
  kind: "tech" | "skill";
  projects: PortfolioData["projects"];
  settings: PortfolioData["settings"];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="related-projects-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-5xl overflow-y-auto rounded-lg border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close related projects"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-black/[0.05] hover:text-ink"
        >
          <X size={18} />
        </button>
        <div className="pr-10">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#0075de]">
            {kind === "tech" ? "Tech" : "Skill"}
          </div>
          <h2 id="related-projects-title" className="mt-2 text-[30px] font-bold leading-none text-ink sm:text-[40px]">
            {label} <span className="font-normal text-muted">({projects.length})</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted">
            Projects connected to this {kind === "tech" ? "technology" : "skill"}.
          </p>
        </div>
        {projects.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} settings={settings} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-black/10 bg-black/[0.02] p-4 text-sm font-semibold text-muted">
            No published projects are connected to this yet.
          </p>
        )}
      </div>
    </div>
  );
}
