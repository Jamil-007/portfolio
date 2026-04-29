"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Search, Star } from "lucide-react";
import { deleteProject, saveProject } from "@/lib/firestore-data";
import type { PortfolioSettings, Project, Technology } from "@/lib/types";
import { settingsOptionLabel, skillLabels } from "@/lib/portfolio-utils";
import { optionChoices, optionSkillChoices, slugify, splitText } from "@/lib/settings-utils";
import { AdminGrid } from "@/components/admin/AdminGrid/AdminGrid";
import { Panel } from "@/components/admin/Panel/Panel";
import { TextInput } from "@/components/admin/TextInput/TextInput";
import { TextArea } from "@/components/admin/TextArea/TextArea";
import { Select } from "@/components/admin/Select/Select";
import { FormActions } from "@/components/admin/FormActions/FormActions";
import { ItemList } from "@/components/admin/ItemList/ItemList";

type ProjectFormValues = Omit<Project, "id" | "screenshots"> & {
  screenshotsText?: string;
};

const emptyProject: ProjectFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  type: "web-app",
  technologies: [],
  featured: false,
  repositoryUrl: "",
  liveUrl: "",
  coverImage: "",
  screenshotsText: "",
  skills: [],
  role: "personal",
  visibility: "draft",
};

export function ProjectsAdmin({ projects, technologies, settings, setMessage }: { projects: Project[]; technologies: Technology[]; settings: PortfolioSettings; setMessage: (value: string) => void }) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const { register, handleSubmit, reset, setValue, watch } = useForm<ProjectFormValues>({ defaultValues: emptyProject });
  const lastProjectAutoSlug = useRef("");
  const title = watch("title");
  const slug = watch("slug");
  const featured = Boolean(watch("featured"));
  const selectedSkills = watch("skills") ?? [];
  const selectedTechnologies = watch("technologies") ?? [];
  const skillOptions = optionSkillChoices(settings.skills, selectedSkills);
  const technologyOptions = useMemo(() => {
    const known = new Set(technologies.map((tech) => tech.id));
    const missing = selectedTechnologies
      .filter((id) => !known.has(id))
      .map((id) => ({ id, name: id }));
    return [...technologies, ...missing];
  }, [technologies, selectedTechnologies]);
  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) =>
      [
        project.title,
        project.shortDescription,
        project.type,
        project.visibility,
        ...project.technologies,
        ...skillLabels(settings.skills, project.skills ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [projectSearch, projects, settings.skills]);

  useEffect(() => {
    if (editing) return;

    const nextSlug = slugify(title);
    if (!nextSlug) {
      lastProjectAutoSlug.current = "";
      return;
    }

    if (!slug || slug === lastProjectAutoSlug.current) {
      setValue("slug", nextSlug, { shouldDirty: true });
      lastProjectAutoSlug.current = nextSlug;
    }
  }, [editing, setValue, slug, title]);

  function edit(project: Project) {
    setEditing(project);
    reset({
      ...project,
      technologies: project.technologies ?? [],
      screenshotsText: project.screenshots?.join(", ") ?? "",
      skills: project.skills ?? [],
    });
  }

  async function submit(values: ProjectFormValues) {
    setMessage("");
    const payload = {
      ...values,
      screenshots: splitText(values.screenshotsText ?? ""),
    };
    const { screenshotsText, ...rest } = payload;
    void screenshotsText;
    await saveProject(rest, editing?.id);
    setEditing(null);
    reset(emptyProject);
    setMessage("Project saved.");
  }

  function toggleSkill(skillId: string) {
    const nextSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter((item) => item !== skillId)
      : [...selectedSkills, skillId];

    setValue("skills", nextSkills, { shouldDirty: true, shouldTouch: true });
  }

  function toggleTechnology(techId: string) {
    const nextTech = selectedTechnologies.includes(techId)
      ? selectedTechnologies.filter((item) => item !== techId)
      : [...selectedTechnologies, techId];

    setValue("technologies", nextTech, { shouldDirty: true, shouldTouch: true });
  }

  return (
    <AdminGrid>
      <Panel title={editing ? `Edit ${editing.title}` : "Add project"}>
        <form onSubmit={handleSubmit(submit)} className="grid gap-3">
          <TextInput label="Title" {...register("title", { required: true })} />
          <TextInput label="Slug" {...register("slug", { required: true })} />
          <TextInput label="Short description" {...register("shortDescription", { required: true })} />
          <TextArea label="Long description" rows={5} {...register("longDescription", { required: true })} />
          <Select label="Type" {...register("type")}>
            {optionChoices(settings.projectTypes, watch("type")).map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </Select>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-ink">Technologies</legend>
            <div className="flex flex-wrap gap-2">
              {technologyOptions.map((tech) => (
                <label
                  key={tech.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm font-semibold ${
                    selectedTechnologies.includes(tech.id)
                      ? "border-[#0075de] bg-[#eef7ff] text-[#005bab]"
                      : "border-black/10 bg-white text-ink hover:bg-black/[0.03]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTechnologies.includes(tech.id)}
                    onChange={() => toggleTechnology(tech.id)}
                    className="h-4 w-4 accent-[#0075de]"
                  />
                  {tech.name}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-ink">Skills used</legend>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <label
                  key={skill.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm font-semibold ${
                    selectedSkills.includes(skill.id)
                      ? "border-[#0075de] bg-[#eef7ff] text-[#005bab]"
                      : "border-black/10 bg-white text-ink hover:bg-black/[0.03]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                    className="h-4 w-4 accent-[#0075de]"
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Repository URL" {...register("repositoryUrl")} />
            <TextInput label="Live URL" {...register("liveUrl")} />
          </div>
          <TextInput label="Cover image URL" {...register("coverImage")} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Role" {...register("role")}>
              {optionChoices(settings.projectRoles, watch("role")).map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </Select>
            <Select label="Visibility" {...register("visibility")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>
          <input type="checkbox" className="sr-only" tabIndex={-1} aria-hidden="true" {...register("featured")} />
          <button
            type="button"
            aria-pressed={featured}
            onClick={() => setValue("featured", !featured, { shouldDirty: true, shouldTouch: true })}
            className={`inline-flex w-fit items-center gap-2 rounded border px-3 py-2 text-sm font-semibold transition ${
              featured
                ? "border-[#ffca28] bg-[#fff8db] text-ink shadow-[0_10px_24px_rgba(255,202,40,0.18)]"
                : "border-black/10 bg-white text-ink hover:bg-black/[0.03]"
            }`}
          >
            <Star
              size={17}
              className={featured ? "text-[#d99700]" : "text-muted"}
              fill={featured ? "#ffca28" : "none"}
            />
            Favorite
          </button>
          <FormActions onCancel={() => { setEditing(null); reset(emptyProject); }} />
        </form>
      </Panel>
      <Panel
        title="Projects"
        action={
          <label className="relative w-full sm:w-56">
            <span className="sr-only">Search projects</span>
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0075de]" />
            <input
              value={projectSearch}
              onChange={(event) => setProjectSearch(event.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded border border-black/10 bg-white pl-9 pr-3 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:border-[#0075de]"
            />
          </label>
        }
      >
        <ItemList
          items={filteredProjects}
          emptyLabel={projectSearch ? "No matching projects." : "No projects yet."}
          primary={(project) => project.title}
          secondary={(project) => settingsOptionLabel(settings.projectTypes, project.type)}
          adornment={(project) =>
            project.featured ? (
              <span title="Favorite" className="inline-flex items-center gap-1 rounded-full bg-[#fff8db] px-2 py-1 text-xs font-semibold text-[#8a6400]">
                <Star size={13} fill="#ffca28" className="text-[#d99700]" />
                Favorite
              </span>
            ) : null
          }
          onEdit={edit}
          onDelete={async (project) => {
            await deleteProject(project.id);
            setMessage("Project deleted.");
          }}
        />
      </Panel>
    </AdminGrid>
  );
}
