"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { SkillSetting } from "@/lib/types";
import { slugify, syncSkillIdToName, uniqueId } from "@/lib/settings-utils";
import { Panel } from "@/components/admin/Panel/Panel";
import { TextInput } from "@/components/admin/TextInput/TextInput";
import { Select } from "@/components/admin/Select/Select";

const skillIconKeys = ["Bot", "Layers3", "Code2", "Database", "Cloud", "Wrench", "GitBranch", "Sparkles", "BriefcaseBusiness"];

export function SkillSettingsEditor({
  skills,
  onChange,
}: {
  skills: SkillSetting[];
  onChange: (skills: SkillSetting[]) => void;
}) {
  const [newSkill, setNewSkill] = useState("");
  const [newIcon, setNewIcon] = useState<string>("Sparkles");

  function addSkill() {
    const name = newSkill.trim();
    if (!name) return;
    onChange([
      ...skills,
      {
        id: uniqueId(name, skills.map((skill) => skill.id)),
        name,
        iconKey: newIcon,
      },
    ]);
    setNewSkill("");
    setNewIcon("Sparkles");
  }

  function deleteSkill(skill: SkillSetting) {
    const name = skill.name.trim() || skill.id;
    if (!window.confirm(`Delete "${name}" from Skills?`)) return;

    onChange(skills.filter((item) => item.id !== skill.id));
  }

  return (
    <div className="grid gap-5">
      <Panel title="Add skill">
        <form
          onSubmit={(event) => { event.preventDefault(); addSkill(); }}
          className="grid gap-3"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <TextInput
              label="Name"
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
            />
            <Select
              label="Icon"
              value={newIcon}
              onChange={(event) => setNewIcon(event.target.value)}
            >
              {skillIconKeys.map((iconKey) => <option key={iconKey} value={iconKey}>{iconKey}</option>)}
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded bg-[#0075de] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005bab]">
              <Save size={16} /> Save
            </button>
            <button
              type="button"
              onClick={() => { setNewSkill(""); setNewIcon("Sparkles"); }}
              className="inline-flex items-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
            >
              <Plus size={16} /> New
            </button>
          </div>
        </form>
      </Panel>
      <Panel title="Skills">
        <div className="grid gap-3">
          {skills.map((skill) => (
            <div key={skill.id} className="grid gap-3 rounded border border-black/10 bg-white p-3">
              <div className="grid gap-2 md:grid-cols-[1fr_150px_auto] md:items-end">
                <TextInput
                  label={`Name (${slugify(skill.name) || skill.id})`}
                  value={skill.name}
                  onChange={(event) => onChange(skills.map((item) => item.id === skill.id ? { ...item, name: event.target.value } : item))}
                  onBlur={() => onChange(syncSkillIdToName(skills, skill.id))}
                />
                <Select
                  label="Icon"
                  value={skill.iconKey}
                  onChange={(event) => onChange(skills.map((item) => item.id === skill.id ? { ...item, iconKey: event.target.value } : item))}
                >
                  {skillIconKeys.map((iconKey) => <option key={iconKey} value={iconKey}>{iconKey}</option>)}
                </Select>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => deleteSkill(skill)}
                    className="inline-flex items-center gap-1 rounded bg-[#fff4eb] px-2 py-2 text-xs font-semibold text-[#b64700] hover:bg-[#ffe7d6]"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!skills.length ? <p className="text-sm text-muted">No skills yet.</p> : null}
        </div>
      </Panel>
    </div>
  );
}
