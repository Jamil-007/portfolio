import { formatLabel } from "@/lib/analytics";
import type { PortfolioData, SettingsOption, SkillSetting } from "@/lib/types";

export function projectMatchesSkill(project: PortfolioData["projects"][number], skill: SkillSetting) {
  return (project.skills ?? []).includes(skill.id);
}

export function settingsOptionLabel(options: SettingsOption[], value: string) {
  return options.find((option) => option.id === value)?.label ?? formatLabel(value);
}

export function skillLabels(skills: SkillSetting[], values: string[]) {
  return values.map((value) => skills.find((skill) => skill.id === value)?.name ?? formatLabel(value));
}

export function settingsOptionsWithUsedValues(options: SettingsOption[], usedValues: string[]) {
  const used = new Set(usedValues);
  const configured = options.map((option) => ({ value: option.id, label: option.label }));
  const configuredValues = new Set(configured.map((option) => option.value));
  const unknown = [...used]
    .filter((value) => !configuredValues.has(value))
    .sort()
    .map((value) => ({ value, label: formatLabel(value) }));

  return [...configured, ...unknown];
}
