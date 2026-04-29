"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { subscribeToPortfolioData } from "@/lib/firestore-data";
import { emptyPortfolioData } from "@/lib/empty-data";
import type { PortfolioData } from "@/lib/types";
import { projectMatchesSkill, settingsOptionLabel, settingsOptionsWithUsedValues, skillLabels } from "@/lib/portfolio-utils";
import { ProjectCard } from "@/components/projects/ProjectCard/ProjectCard";
import { SearchableDropdown } from "@/components/projects/SearchableDropdown/SearchableDropdown";
import { NavPill } from "@/components/layout/NavPill/NavPill";
import { BackHomeLink } from "@/components/layout/BackHomeLink/BackHomeLink";

const PROJECTS_PAGE_SIZE = 2;

export function ProjectsPage() {
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);
  const [type, setType] = useState("all");
  const [techFilter, setTechFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => subscribeToPortfolioData(setData), []);

  const skills = useMemo(
    () => data.settings.skills,
    [data.settings.skills],
  );
  const typeOptions = [
    { value: "all", label: "All projects" },
    ...settingsOptionsWithUsedValues(data.settings.projectTypes, data.projects.map((project) => project.type)),
  ];
  const techOptions = [...new Set(data.projects.flatMap((project) => project.technologies))].sort();
  const projects = data.projects.filter((project) => {
    const matchesType = type === "all" || project.type === type;
    const matchesTech = !techFilter || project.technologies.includes(techFilter);
    const selectedSkill = skills.find((skill) => skill.id === skillFilter);
    const matchesSkill = !skillFilter || (selectedSkill ? projectMatchesSkill(project, selectedSkill) : false);
    const query = search.trim().toLowerCase();
    const matchesSearch = query
      ? [
          project.title,
          project.shortDescription,
          project.longDescription,
          project.type,
          settingsOptionLabel(data.settings.projectTypes, project.type),
          ...project.technologies,
          ...skillLabels(data.settings.skills, project.skills ?? []),
        ].some((value) => value.toLowerCase().includes(query))
      : true;

    return matchesType && matchesTech && matchesSkill && matchesSearch;
  });
  const totalPages = Math.ceil(projects.length / PROJECTS_PAGE_SIZE);
  const activePage = Math.min(page, Math.max(0, totalPages - 1));
  const visibleProjects = projects.slice(
    activePage * PROJECTS_PAGE_SIZE,
    activePage * PROJECTS_PAGE_SIZE + PROJECTS_PAGE_SIZE,
  );
  const hasPagination = totalPages > 1;

  useEffect(() => {
    setPage(0);
  }, [search, skillFilter, techFilter, type]);

  return (
    <main>
      <NavPill />
      <section className="section-pad bg-white">
        <div className="container">
          <BackHomeLink />
          <h1 className="text-[44px] font-bold leading-none tracking-[-1.2px] text-ink sm:text-[56px]">
            Projects <span className="font-normal text-muted">({data.projects.length})</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-muted">
            A filterable record of finished work, active builds, and focused experiments.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <SearchableDropdown
              ariaLabel="Filter project type"
              value={type}
              options={typeOptions}
              onChange={setType}
            />
            <SearchableDropdown
              ariaLabel="Filter project tech"
              value={techFilter}
              options={[
                { value: "", label: "All tech" },
                ...techOptions.map((technology) => ({ value: technology, label: technology })),
              ]}
              onChange={setTechFilter}
            />
            <SearchableDropdown
              ariaLabel="Filter project skill"
              value={skillFilter}
              options={[
                { value: "", label: "All skills" },
                ...skills.map((skill) => ({ value: skill.id, label: skill.name })),
              ]}
              onChange={setSkillFilter}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="relative w-36 sm:w-40">
              <span className="sr-only">Search projects</span>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0075de]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-8 w-full rounded-full border border-[#0075de] bg-white pl-8 pr-3 text-xs font-semibold text-ink outline-none placeholder:text-muted"
              />
            </label>
            {hasPagination ? (
              <>
                <button
                  type="button"
                  aria-label="Previous projects"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white"
                  onClick={() => setPage((value) => (value - 1 + totalPages) % totalPages)}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Next projects"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white"
                  onClick={() => setPage((value) => (value + 1) % totalPages)}
                >
                  <ChevronRight size={15} />
                </button>
              </>
            ) : null}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} settings={data.settings} />
            ))}
          </div>
          {!visibleProjects.length ? (
            <p className="mt-8 text-base font-semibold text-muted">No projects match this search.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
