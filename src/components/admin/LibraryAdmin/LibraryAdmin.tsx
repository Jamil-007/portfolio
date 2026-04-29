"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { savePortfolioSettings } from "@/lib/firestore-data";
import type { PortfolioSettings, SettingsOption, Technology } from "@/lib/types";
import { cloneSettings, normalizeDraftSettings } from "@/lib/settings-utils";
import { Panel } from "@/components/admin/Panel/Panel";
import { LibraryCard } from "@/components/admin/LibraryCard/LibraryCard";
import { Modal } from "@/components/admin/Modal/Modal";
import { TechnologyAdmin } from "@/components/admin/TechnologyAdmin/TechnologyAdmin";
import { OptionGroupEditor } from "@/components/admin/OptionGroupEditor/OptionGroupEditor";
import { SkillSettingsEditor } from "@/components/admin/SkillSettingsEditor/SkillSettingsEditor";

type OptionGroupKey = "projectTypes" | "projectRoles";
type LibrarySection = "technologies" | OptionGroupKey | "skills";

const optionGroups: Array<{ key: OptionGroupKey; title: string }> = [
  { key: "projectTypes", title: "Project types" },
  { key: "projectRoles", title: "Project roles" },
];

export function LibraryAdmin({
  technologies,
  settings,
  setMessage,
}: {
  technologies: Technology[];
  settings: PortfolioSettings;
  setMessage: (value: string) => void;
}) {
  const [draft, setDraft] = useState<PortfolioSettings>(() => cloneSettings(settings));
  const [openSection, setOpenSection] = useState<LibrarySection | null>(null);

  useEffect(() => {
    setDraft(cloneSettings(settings));
  }, [settings]);

  function setOptionGroup(key: OptionGroupKey, items: SettingsOption[]) {
    setDraft((value) => ({ ...value, [key]: items }));
  }

  async function handleSave() {
    setMessage("");
    try {
      await savePortfolioSettings(normalizeDraftSettings(draft));
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Settings save failed.");
    }
  }

  const activeOptionGroup = optionGroups.find((group) => group.key === openSection);

  return (
    <div>
      <Panel title="Library">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <LibraryCard
            title="Technologies"
            count={technologies.length}
            description="Tools and platforms shown in the tech section."
            onClick={() => setOpenSection("technologies")}
          />
          <LibraryCard
            title="Project types"
            count={draft.projectTypes.length}
            description="Reusable project type labels for project forms and filters."
            onClick={() => setOpenSection("projectTypes")}
          />
          <LibraryCard
            title="Project roles"
            count={draft.projectRoles.length}
            description="Reusable role labels for project ownership/context."
            onClick={() => setOpenSection("projectRoles")}
          />
          <LibraryCard
            title="Skills"
            count={draft.skills.length}
            description="Skill chips used by projects and public filters."
            onClick={() => setOpenSection("skills")}
          />
        </div>
      </Panel>

      {openSection ? (
        <Modal
          title={openSection === "technologies" ? "Technologies" : openSection === "skills" ? "Skills" : activeOptionGroup?.title ?? "Library"}
          onClose={() => setOpenSection(null)}
          action={
            openSection === "technologies" ? null : (
              <button onClick={handleSave} className="inline-flex items-center gap-2 rounded bg-[#0075de] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005bab]">
                <Save size={16} /> Save changes
              </button>
            )
          }
        >
          {openSection === "technologies" ? <TechnologyAdmin technologies={technologies} setMessage={setMessage} /> : null}
          {activeOptionGroup ? (
            <OptionGroupEditor
              title={activeOptionGroup.title}
              items={draft[activeOptionGroup.key]}
              onChange={(items) => setOptionGroup(activeOptionGroup.key, items)}
            />
          ) : null}
          {openSection === "skills" ? (
            <SkillSettingsEditor
              skills={draft.skills}
              onChange={(skills) => setDraft((value) => ({ ...value, skills }))}
            />
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}
