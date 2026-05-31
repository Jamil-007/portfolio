import { formatLabel } from "@/lib/analytics";
import type { PortfolioData, ProjectType, Skill } from "@/lib/types";

export function projectMatchesSkill(project: PortfolioData["projects"][number], skill: Skill) {
  return (project.skills ?? []).includes(skill.id);
}

export function projectTypeLabel(projectTypes: ProjectType[], value: string) {
  return projectTypes.find((type) => type.id === value)?.label ?? formatLabel(value);
}

export function skillLabels(skills: Skill[], values: string[]) {
  return values.map((value) => skills.find((skill) => skill.id === value)?.name ?? formatLabel(value));
}

export function projectTypesWithUsedValues(projectTypes: ProjectType[], usedValues: string[]) {
  const used = new Set(usedValues);
  const configured = projectTypes.map((type) => ({ value: type.id, label: type.label }));
  const configuredValues = new Set(configured.map((type) => type.value));
  const unknown = [...used]
    .filter((value) => !configuredValues.has(value))
    .sort()
    .map((value) => ({ value, label: formatLabel(value) }));

  return [...configured, ...unknown];
}
