import { formatLabel } from "@/lib/analytics";
import type { PortfolioSettings, SettingsOption, SkillSetting } from "@/lib/types";

export function splitText(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function optionChoices(options: SettingsOption[], current?: string) {
  if (current && !options.some((option) => option.id === current)) {
    return [...options, { id: current, label: formatLabel(current) }];
  }

  return options;
}

export function optionSkillChoices(skills: SkillSetting[], current: string[]) {
  const selected = new Set(current);
  const missingSkills = [...selected]
    .filter((skillId) => !skills.some((skill) => skill.id === skillId))
    .map((skillId) => ({ id: skillId, name: formatLabel(skillId), iconKey: "Sparkles" }));

  return [...skills, ...missingSkills];
}

export function cloneSettings(settings: PortfolioSettings): PortfolioSettings {
  const projectTypes = syncOptionGroupIdsToLabels(settings.projectTypes);
  const projectRoles = syncOptionGroupIdsToLabels(settings.projectRoles);

  return {
    projectTypes: projectTypes.items,
    projectRoles: projectRoles.items,
    skills: settings.skills.map(cleanSkillSetting),
  };
}

export function normalizeDraftSettings(settings: PortfolioSettings): PortfolioSettings {
  return {
    projectTypes: settings.projectTypes.map(cleanSettingsOption),
    projectRoles: settings.projectRoles.map(cleanSettingsOption),
    skills: syncSkillGroupIdsToNames(settings.skills).items.map(cleanSkillSetting),
  };
}

export function cleanSettingsOption(option: SettingsOption): SettingsOption {
  return {
    id: option.id,
    label: option.label,
  };
}

export function cleanSkillSetting(skill: SkillSetting): SkillSetting {
  return {
    id: skill.id,
    name: skill.name,
    iconKey: skill.iconKey,
  };
}

export function syncOptionIdToLabel(items: SettingsOption[], id: string) {
  const option = items.find((item) => item.id === id);
  if (!option) return items;

  const nextId = slugify(option.label);
  if (!nextId || nextId === option.id) return items;

  const existingIds = items.filter((item) => item.id !== id).map((item) => item.id);
  return items.map((item) =>
    item.id === id
      ? {
          ...item,
          id: uniqueId(nextId, existingIds),
        }
      : item,
  );
}

export function syncOptionGroupIdsToLabels(items: SettingsOption[]) {
  const usedIds: string[] = [];
  const idMap: Record<string, string> = {};
  const syncedItems = items.map((item) => {
    const nextId = uniqueId(slugify(item.label) || item.id || "option", usedIds);
    usedIds.push(nextId);
    idMap[item.id] = nextId;
    return { ...item, id: nextId };
  });

  return { items: syncedItems, idMap };
}

export function syncSkillIdToName(skills: SkillSetting[], id: string) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) return skills;

  const nextId = slugify(skill.name);
  if (!nextId || nextId === skill.id) return skills;

  const existingIds = skills.filter((item) => item.id !== id).map((item) => item.id);
  return skills.map((item) =>
    item.id === id
      ? {
          ...item,
          id: uniqueId(nextId, existingIds),
        }
      : item,
  );
}

export function syncSkillGroupIdsToNames(skills: SkillSetting[]) {
  const usedIds: string[] = [];
  const idMap: Record<string, string> = {};
  const syncedItems = skills.map((skill) => {
    const nextId = uniqueId(slugify(skill.name) || skill.id || "skill", usedIds);
    usedIds.push(nextId);
    idMap[skill.id] = nextId;
    return { ...skill, id: nextId };
  });

  return { items: syncedItems, idMap };
}

export function uniqueId(label: string, existingIds: string[]) {
  const base = slugify(label) || "option";
  let id = base;
  let suffix = 2;

  while (existingIds.includes(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  return id;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
