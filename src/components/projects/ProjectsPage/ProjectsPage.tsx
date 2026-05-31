"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { projectMatchesSkill, projectTypeLabel, projectTypesWithUsedValues, skillLabels } from "@/lib/portfolio-utils";
import { ProjectCard } from "@/components/shared/ProjectCard/ProjectCard";
import { SearchableDropdown } from "@/components/projects/SearchableDropdown/SearchableDropdown";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";

const PROJECTS_PAGE_SIZE = 9;

export function ProjectsPage() {
  const data = portfolioData;
  const [type, setType] = useState("all");
  const [techFilter, setTechFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    (type !== "all" ? 1 : 0) + (techFilter ? 1 : 0) + (skillFilter ? 1 : 0);

  const skills = useMemo(() => data.skills, [data.skills]);
  const typeOptions = [
    { value: "all", label: "All projects" },
    ...projectTypesWithUsedValues(data.projectTypes, data.projects.map((project) => project.type)),
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
          project.type,
          projectTypeLabel(data.projectTypes, project.type),
          ...project.technologies,
          ...skillLabels(data.skills, project.skills ?? []),
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
    <main className="bg-cream text-ink min-h-screen">
      <SiteHeader email={data.profile.email} currentPath="/projects" photoUrl={data.profile.photoUrl} name={data.profile.name} />
      <section className="pt-28 pb-24 sm:pt-36">
        <div className="container">
          <Link
            href="/"
            className="mono-label inline-flex items-center gap-2 text-muted transition hover:text-ink"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <h1 className="serif-display mt-3 text-[clamp(2.75rem,9vw,7rem)]">
            Projects <span className="serif-italic text-muted">({data.projects.length})</span>
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <label className="relative w-full sm:w-72">
              <span className="sr-only">Search projects</span>
              <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects"
                className="h-10 w-full rounded-full border border-[rgba(23,23,23,0.2)] bg-paper pl-10 pr-3 text-sm text-ink placeholder:text-quiet transition focus:border-ink focus:ring-2 focus:ring-ink/15 focus-visible:[outline:none]"
              />
            </label>
            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-label={filtersOpen ? "Hide filters" : "Show filters"}
              onClick={() => setFiltersOpen((value) => !value)}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                filtersOpen || activeFilterCount > 0
                  ? "border-ink bg-ink text-cream hover:bg-accent hover:border-accent"
                  : "border-[rgba(23,23,23,0.2)] text-ink hover:border-ink"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filter</span>
              {activeFilterCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1.5 font-mono text-[10px] text-ink">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>

          {filtersOpen ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
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
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setType("all");
                    setTechFilter("");
                    setSkillFilter("");
                  }}
                  className="mono-label text-quiet transition hover:text-ink"
                >
                  Clear
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} projectTypes={data.projectTypes} />
            ))}
          </div>

          {!visibleProjects.length ? (
            <p className="mt-12 font-mono text-sm text-muted">No projects match this search.</p>
          ) : null}

          {hasPagination ? (
            <div className="mt-14 flex items-center justify-between border-t border-[rgba(23,23,23,0.12)] pt-6">
              <div className="mono-label text-quiet">
                Page {activePage + 1} / {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous projects"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(23,23,23,0.2)] text-ink transition hover:border-ink"
                  onClick={() => setPage((value) => (value - 1 + totalPages) % totalPages)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next projects"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(23,23,23,0.2)] text-ink transition hover:border-ink"
                  onClick={() => setPage((value) => (value + 1) % totalPages)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
