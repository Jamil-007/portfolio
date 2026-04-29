"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Github, Linkedin, Search, Sparkles } from "lucide-react";
import { subscribeToPortfolioData } from "@/lib/firestore-data";
import { emptyPortfolioData } from "@/lib/empty-data";
import type { PortfolioData } from "@/lib/types";
import { projectMatchesSkill } from "@/lib/portfolio-utils";
import { ProjectCard } from "@/components/projects/ProjectCard/ProjectCard";
import { NavPill } from "@/components/layout/NavPill/NavPill";
import { ChatbotPreview } from "@/components/layout/ChatbotPreview/ChatbotPreview";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon/TechnologyIcon";
import { SkillPill, skillIconMap } from "@/components/shared/SkillPill/SkillPill";
import { DesktopHeroPhoto, MobileHeroPhoto } from "@/components/home/HeroPhoto/HeroPhoto";
import { FunFactModal } from "@/components/home/FunFact/FunFact";
import { RelatedProjectsModal } from "@/components/home/RelatedProjectsModal/RelatedProjectsModal";

const TECH_PAGE_SIZE = 10;
const SKILL_PAGE_SIZE = 5;

export function HomePage() {
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);
  const [showFunFact, setShowFunFact] = useState(false);
  const [techPage, setTechPage] = useState(0);
  const [techSearch, setTechSearch] = useState("");
  const [skillPage, setSkillPage] = useState(0);
  const [skillSearch, setSkillSearch] = useState("");
  const [projectModal, setProjectModal] = useState<{ kind: "tech" | "skill"; name: string } | null>(null);

  useEffect(() => subscribeToPortfolioData(setData), []);

  const publishedProjects = useMemo(
    () => data.projects.filter((project) => project.visibility === "published"),
    [data.projects],
  );
  const featuredProjects = useMemo(
    () => publishedProjects.filter((project) => project.featured).slice(0, 6),
    [publishedProjects],
  );
  const skills = useMemo(
    () => data.settings.skills,
    [data.settings.skills],
  );
  const modalProjects = useMemo(() => {
    if (!projectModal) {
      return [];
    }

    if (projectModal.kind === "tech") {
      return publishedProjects.filter((project) =>
        project.technologies.some((technology) => technology.toLowerCase() === projectModal.name.toLowerCase()),
      );
    }

    const skill = skills.find((item) => item.name === projectModal.name);
    return skill ? publishedProjects.filter((project) => projectMatchesSkill(project, skill)) : [];
  }, [projectModal, publishedProjects, skills]);
  const featuredTechnologies = useMemo(
    () => data.technologies.slice(0, 14),
    [data.technologies],
  );
  const filteredTechnologies = useMemo(() => {
    const query = techSearch.trim().toLowerCase();

    if (!query) {
      return featuredTechnologies;
    }

    return featuredTechnologies.filter((technology) => technology.name.toLowerCase().includes(query));
  }, [featuredTechnologies, techSearch]);
  const filteredSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();

    if (!query) {
      return skills;
    }

    return skills.filter((skill) => skill.name.toLowerCase().includes(query));
  }, [skillSearch, skills]);
  const publishedProjectCount = data.projects.filter((project) => project.visibility === "published").length;
  const displayName = data.profile.name.replace(" Andrew ", " ");
  const totalTechPages = Math.ceil(filteredTechnologies.length / TECH_PAGE_SIZE);
  const activeTechPage = Math.min(techPage, Math.max(0, totalTechPages - 1));
  const visibleTechnologies = filteredTechnologies.slice(
    activeTechPage * TECH_PAGE_SIZE,
    activeTechPage * TECH_PAGE_SIZE + TECH_PAGE_SIZE,
  );
  const hasTechPagination = totalTechPages > 1;
  const totalSkillPages = Math.ceil(filteredSkills.length / SKILL_PAGE_SIZE);
  const activeSkillPage = Math.min(skillPage, Math.max(0, totalSkillPages - 1));
  const visibleSkills = filteredSkills.slice(
    activeSkillPage * SKILL_PAGE_SIZE,
    activeSkillPage * SKILL_PAGE_SIZE + SKILL_PAGE_SIZE,
  );
  const hasSkillPagination = totalSkillPages > 1;

  useEffect(() => {
    setTechPage(0);
  }, [techSearch]);

  useEffect(() => {
    setSkillPage(0);
  }, [skillSearch]);

  return (
    <main>
      <NavPill />
      <ChatbotPreview />
      {showFunFact ? (
        <FunFactModal
          funFact={data.profile.funFact}
          onClose={() => setShowFunFact(false)}
        />
      ) : null}
      {projectModal ? (
        <RelatedProjectsModal
          label={projectModal.name}
          kind={projectModal.kind}
          projects={modalProjects}
          settings={data.settings}
          onClose={() => setProjectModal(null)}
        />
      ) : null}
      <section id="top" className="section-pad bg-white max-[700px]:pb-8">
        <div className="container">
          <div className="grid items-center gap-4 md:grid-cols-[160px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
            <DesktopHeroPhoto
              name={data.profile.name}
              photoUrl={data.profile.photoUrl}
              onFunFactClick={() => setShowFunFact((value) => !value)}
              showFunFact={showFunFact}
            />
            <div className="grid max-w-4xl grid-cols-[minmax(104px,28vw)_minmax(0,1fr)] items-stretch gap-4 sm:grid-cols-[132px_minmax(0,1fr)] md:block">
              <div className="row-span-3 md:hidden">
                <MobileHeroPhoto
                  name={data.profile.name}
                  photoUrl={data.profile.photoUrl}
                  onFunFactClick={() => setShowFunFact((value) => !value)}
                  showFunFact={showFunFact}
                />
              </div>
              <div className="self-end">
                <h1 className="text-[clamp(1.85rem,8.5vw,3.5rem)] font-bold leading-none tracking-[-1px] text-ink md:text-[64px] md:tracking-[-2.125px]">
                  {displayName}
                </h1>
                <a
                  href={`mailto:${data.profile.email}`}
                  className="mt-3 inline-flex text-sm font-semibold text-[#0075de] hover:underline sm:text-[15px]"
                >
                  {data.profile.email}
                </a>
              </div>
              <div className="relative col-start-2" />
              <div className="col-start-2 self-start">
                <p className="text-[clamp(0.95rem,4vw,1.5rem)] font-semibold leading-snug text-muted">
                  AI & Software Engineer
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
                  <Link href="/projects" className="inline-flex items-center gap-2 rounded bg-[#0075de] px-3 py-2 text-sm font-semibold text-white hover:bg-[#005bab] sm:px-4 sm:text-[15px]">
                    View {publishedProjectCount} projects <ArrowRight size={16} />
                  </Link>
                  <a href={data.profile.resumeUrl} className="rounded bg-black/[0.05] px-3 py-2 text-sm font-semibold text-ink hover:bg-black/[0.08] sm:px-4 sm:text-[15px]">
                    Resume
                  </a>
                  <a href={data.profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="inline-flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-black/[0.05] sm:w-auto sm:gap-2 sm:px-3 sm:py-2 sm:text-[15px] sm:font-semibold sm:hover:bg-transparent sm:hover:underline">
                    <Github size={16} /> <span className="hidden sm:inline">GitHub</span>
                  </a>
                  <a href={data.profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-black/[0.05] sm:w-auto sm:gap-2 sm:px-3 sm:py-2 sm:text-[15px] sm:font-semibold sm:hover:bg-transparent sm:hover:underline">
                    <Linkedin size={16} /> <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="tech-stack" className="bg-white pb-16">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div id="skills">
            <h2 className="text-[28px] font-bold leading-none text-ink sm:text-[36px]">
              Skills <span className="font-normal text-muted">({skills.length})</span>
            </h2>
            <div className="mb-3 mt-4 flex flex-wrap items-center gap-2">
              <label className="relative w-36 sm:w-40">
                <span className="sr-only">Search skills</span>
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0075de]" />
                <input
                  type="search"
                  value={skillSearch}
                  onChange={(event) => setSkillSearch(event.target.value)}
                  placeholder="Search"
                  className="h-8 w-full rounded-full border border-[#0075de] bg-white pl-8 pr-3 text-xs font-semibold text-ink outline-none placeholder:text-muted"
                />
              </label>
              {hasSkillPagination ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous skills"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white"
                    onClick={() => setSkillPage((page) => (page - 1 + totalSkillPages) % totalSkillPages)}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next skills"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white"
                    onClick={() => setSkillPage((page) => (page + 1) % totalSkillPages)}
                  >
                    <ChevronRight size={15} />
                  </button>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {visibleSkills.map((skill) => (
                <SkillPill
                  key={skill.name}
                  name={skill.name}
                  icon={skillIconMap[skill.iconKey as keyof typeof skillIconMap] ?? Sparkles}
                  onClick={() => setProjectModal({ kind: "skill", name: skill.name })}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[28px] font-bold leading-none text-ink sm:text-[36px]">
              Tech <span className="font-normal text-muted">({featuredTechnologies.length})</span>
            </h2>
            <div className="mb-3 mt-4 flex flex-wrap items-center gap-2">
              <label className="relative w-36 sm:w-40">
                <span className="sr-only">Search tech stack</span>
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0075de]" />
                <input
                  type="search"
                  value={techSearch}
                  onChange={(event) => setTechSearch(event.target.value)}
                  placeholder="Search"
                  className="h-8 w-full rounded-full border border-[#0075de] bg-white pl-8 pr-3 text-xs font-semibold text-ink outline-none placeholder:text-muted"
                />
              </label>
              {hasTechPagination ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous technologies"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white"
                    onClick={() => setTechPage((page) => (page - 1 + totalTechPages) % totalTechPages)}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next technologies"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white"
                    onClick={() => setTechPage((page) => (page + 1) % totalTechPages)}
                  >
                    <ChevronRight size={15} />
                  </button>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {visibleTechnologies.map((technology) => (
                <TechnologyIcon
                  key={technology.id}
                  name={technology.name}
                  icon={technology.icon}
                  onClick={() => setProjectModal({ kind: "tech", name: technology.name })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="featured" className="section-pad bg-white">
        <div className="container">
          <div className="mb-8">
            <div>
              <h2 className="text-[36px] font-bold leading-none tracking-[-1px] text-ink sm:text-[48px] sm:tracking-[-1.5px]">
                My Favorite Projects
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-6 text-muted">
                The work recruiters should see first: finished builds, useful experiments, and active projects labeled clearly.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} settings={data.settings} />
            ))}
          </div>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-2 rounded bg-[#0075de] px-3 py-2 text-sm font-semibold text-white hover:bg-[#005bab] sm:px-4 sm:text-[15px]">
            View all projects <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
