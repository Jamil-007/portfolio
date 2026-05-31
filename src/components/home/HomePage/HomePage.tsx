"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Search, Sparkles, X } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { ProjectRow } from "@/components/shared/ProjectRow/ProjectRow";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon/TechnologyIcon";
import { SkillPill, skillIconMap } from "@/components/shared/SkillPill/SkillPill";
import { useReveal } from "@/components/home/UseReveal/useReveal";
import { RelatedProjectsModal } from "@/components/home/RelatedProjectsModal/RelatedProjectsModal";

type ProjectModalTarget =
  | { kind: "tech"; id: string; name: string }
  | { kind: "skill"; id: string; name: string };

export function HomePage() {
  const data = portfolioData;
  const [toolboxQuery, setToolboxQuery] = useState("");
  const [projectModal, setProjectModal] = useState<ProjectModalTarget | null>(null);

  const projects = data.projects;
  const favoriteProject = useMemo(
    () => projects.find((project) => project.slug === data.favoriteProjectSlug) ?? null,
    [projects, data.favoriteProjectSlug],
  );
  const projectModalMatches = useMemo(() => {
    if (!projectModal) return [];
    if (projectModal.kind === "tech") {
      return projects.filter((project) =>
        project.technologies.includes(projectModal.id),
      );
    }
    return projects.filter((project) =>
      (project.skills ?? []).includes(projectModal.id),
    );
  }, [projectModal, projects]);
  const displayName = data.profile.name || "Jamil Orata";
  const year = new Date().getFullYear();
  const animatedCount = useCountUp(projects.length, 1600);

  // The Toolbox only surfaces tech/skills actually referenced by at least one
  // project — the master `data.technologies` and `data.skills` lists are just
  // the metadata registry (id → name + icon).
  const usedTechIds = useMemo(
    () => new Set(projects.flatMap((project) => project.technologies)),
    [projects],
  );
  const usedSkillIds = useMemo(
    () => new Set(projects.flatMap((project) => project.skills ?? [])),
    [projects],
  );
  const inUseTechnologies = useMemo(
    () => data.technologies.filter((technology) => usedTechIds.has(technology.id)),
    [data.technologies, usedTechIds],
  );
  const inUseSkills = useMemo(
    () => data.skills.filter((skill) => usedSkillIds.has(skill.id)),
    [data.skills, usedSkillIds],
  );

  const toolboxQueryNormalized = toolboxQuery.trim().toLowerCase();
  const filteredTechnologies = useMemo(
    () =>
      toolboxQueryNormalized
        ? inUseTechnologies.filter((technology) =>
            technology.name.toLowerCase().includes(toolboxQueryNormalized),
          )
        : inUseTechnologies,
    [inUseTechnologies, toolboxQueryNormalized],
  );
  const filteredSkills = useMemo(
    () =>
      toolboxQueryNormalized
        ? inUseSkills.filter((skill) => skill.name.toLowerCase().includes(toolboxQueryNormalized))
        : inUseSkills,
    [inUseSkills, toolboxQueryNormalized],
  );

  const workIntroReveal = useReveal<HTMLDivElement>();
  const toolboxReveal = useReveal<HTMLDivElement>();
  const contactReveal = useReveal<HTMLDivElement>();

  return (
    <main className="bg-cream text-ink">
      <SiteHeader email={data.profile.email} currentPath="/" photoUrl={data.profile.photoUrl} name={data.profile.name} />
      {projectModal ? (
        <RelatedProjectsModal
          label={projectModal.name}
          kind={projectModal.kind}
          projects={projectModalMatches}
          onClose={() => setProjectModal(null)}
        />
      ) : null}

      {/* HERO */}
      <section id="top" className="relative min-h-[100svh] overflow-hidden pt-28 sm:pt-32">
        <div className="container relative">
          {data.profile.email ? (
            <a
              href={`mailto:${data.profile.email}`}
              className="inline-flex items-center font-mono text-[12px] font-medium text-muted transition-colors hover:text-ink"
            >
              {data.profile.email}
            </a>
          ) : null}

          <h1 className="serif-display animate-rise-in mt-12 text-[clamp(2.25rem,7vw,6.25rem)] [text-wrap:balance] sm:mt-16">
            I&apos;ve worked on{" "}
            <span className="serif-italic text-accent tabular-nums">
              {animatedCount.toString().padStart(2, "0")}
            </span>{" "}
            projects, turning ideas into practical software.
          </h1>

          <div className="mt-12 max-w-xl">
            <p className="text-[17px] leading-8 text-muted sm:text-lg animate-rise-in" style={{ animationDelay: "260ms" }}>
              I&apos;m <span className="text-ink font-medium">{displayName}</span>, an AI &amp; software engineer based in the Philippines.
              <br />
              I specialize in AI integration and automation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 animate-rise-in" style={{ animationDelay: "340ms" }}>
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-accent"
              >
                See all projects
              </Link>
              {data.profile.githubUrl ? (
                <a
                  href={data.profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] text-sm font-medium text-ink transition hover:border-ink sm:h-auto sm:w-auto sm:px-5 sm:py-2.5"
                >
                  <Github size={14} />
                  <span className="hidden sm:inline">GitHub</span>
                  <ArrowUpRight size={14} className="hidden sm:inline-block" />
                </a>
              ) : null}
              {data.profile.linkedinUrl ? (
                <a
                  href={data.profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] text-sm font-medium text-ink transition hover:border-ink sm:h-auto sm:w-auto sm:px-5 sm:py-2.5"
                >
                  <Linkedin size={14} />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <ArrowUpRight size={14} className="hidden sm:inline-block" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="container mt-20 pb-10 sm:mt-28">
          <a href="#toolbox" aria-label="Scroll to next section" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center text-ink/70 animate-scroll-cue transition-colors group-hover:text-accent">
              <ArrowDown size={14} strokeWidth={2.2} />
            </span>
            <span className="mono-label text-quiet transition-colors group-hover:text-ink">Scroll</span>
          </a>
        </div>
      </section>

      {/* TOOLBOX */}
      <section id="toolbox" className="border-t border-[rgba(23,23,23,0.12)] bg-paper py-20 sm:py-24">
        <div className="container">
          <div
            ref={toolboxReveal.ref}
            className={`transition-all duration-700 ${
              toolboxReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="mono-label text-quiet">Toolbox</div>
            <h2 className="serif-display mt-3 text-[clamp(2rem,5vw,3.5rem)]">
              What I work <span className="serif-italic text-muted">with.</span>
            </h2>
            <label className="relative mt-6 block w-full max-w-sm">
              <span className="sr-only">Search tech and skills</span>
              <Search
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={toolboxQuery}
                onChange={(event) => setToolboxQuery(event.target.value)}
                placeholder="Search tech & skills"
                className="h-10 w-full rounded-full border border-[rgba(23,23,23,0.18)] bg-cream pl-10 pr-9 font-mono text-[12px] text-ink placeholder:text-quiet transition focus:border-ink focus:ring-2 focus:ring-ink/15 focus-visible:[outline:none]"
              />
              {toolboxQuery ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setToolboxQuery("")}
                  className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-quiet transition hover:bg-black/[0.06] hover:text-ink focus-visible:[outline:none]"
                >
                  <X size={12} />
                </button>
              ) : null}
            </label>
          </div>

          {filteredTechnologies.length ? (
            <div className="mt-10 sm:mt-14">
              <div className="mono-label mb-4 text-quiet">
                Tech
                {toolboxQuery ? (
                  <span className="ml-2 text-quiet">({filteredTechnologies.length})</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {filteredTechnologies.map((technology) => (
                  <TechnologyIcon
                    key={technology.id}
                    name={technology.name}
                    icon={technology.icon}
                    onClick={() =>
                      setProjectModal({ kind: "tech", id: technology.id, name: technology.name })
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {filteredSkills.length ? (
            <div className="mt-10">
              <div className="mono-label mb-4 text-quiet">
                Skills
                {toolboxQuery ? (
                  <span className="ml-2 text-quiet">({filteredSkills.length})</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {filteredSkills.map((skill) => (
                  <SkillPill
                    key={skill.id}
                    name={skill.name}
                    icon={skillIconMap[skill.iconKey as keyof typeof skillIconMap] ?? Sparkles}
                    onClick={() =>
                      setProjectModal({ kind: "skill", id: skill.id, name: skill.name })
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {toolboxQuery && !filteredTechnologies.length && !filteredSkills.length ? (
            <p className="mt-10 font-mono text-sm text-muted">
              Nothing matches &ldquo;{toolboxQuery}&rdquo;.
            </p>
          ) : null}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" className="bg-cream pt-20 sm:pt-24">
        <div className="container">
          <div
            ref={workIntroReveal.ref}
            className={`transition-all duration-700 ${
              workIntroReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="mono-label text-quiet">Favorite</div>
            <h2 className="serif-display mt-3 text-[clamp(2.25rem,6vw,4.5rem)]">
              My favorite <span className="serif-italic text-muted">project.</span>
            </h2>
            <Link
              href="/projects"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
            >
              View all projects
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 sm:mt-8">
            {favoriteProject ? (
              <ProjectRow project={favoriteProject} index={0} />
            ) : (
              <div className="border-t border-[rgba(23,23,23,0.12)] py-16 text-center">
                <p className="font-mono text-sm text-muted">No favorite project yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-pad">
        <div className="container">
          <div
            ref={contactReveal.ref}
            className={`transition-all duration-700 ${
              contactReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="mono-label text-quiet">Contact</div>
            <h2 className="serif-display mt-3 text-[clamp(2.75rem,11vw,9rem)] leading-[0.95]">
              Let&apos;s build <br />
              <span className="serif-italic text-accent">something</span> good.
            </h2>
            {data.profile.email ? (
              <a
                href={`mailto:${data.profile.email}`}
                className="group mt-10 inline-flex items-baseline gap-3 text-[clamp(1.25rem,3vw,2rem)] font-medium tracking-tightish text-ink"
              >
                <Mail size={20} className="translate-y-1 text-accent" />
                <span className="underline decoration-[rgba(23,23,23,0.25)] decoration-1 underline-offset-[6px] transition-all group-hover:decoration-accent group-hover:underline-offset-[10px]">
                  {data.profile.email}
                </span>
              </a>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-2">
              {data.profile.githubUrl ? (
                <a
                  href={data.profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] px-4 py-2 text-sm font-medium text-ink transition hover:border-ink"
                >
                  <Github size={14} /> GitHub <ArrowUpRight size={12} />
                </a>
              ) : null}
              {data.profile.linkedinUrl ? (
                <a
                  href={data.profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] px-4 py-2 text-sm font-medium text-ink transition hover:border-ink"
                >
                  <Linkedin size={14} /> LinkedIn <ArrowUpRight size={12} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(23,23,23,0.12)] py-8">
        <div className="container">
          <div className="mono-label text-quiet">© {year} {displayName}. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}

function useCountUp(target: number, durationMs = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setCount(0);
      return;
    }

    // Always restart from 0 on mount or when target changes so the animation
    // re-runs on client-side navigation back to this page.
    setCount(0);
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return count;
}
