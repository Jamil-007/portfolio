"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { SettingsOption } from "@/lib/types";
import { syncOptionIdToLabel, uniqueId } from "@/lib/settings-utils";
import { Panel } from "@/components/admin/Panel/Panel";
import { TextInput } from "@/components/admin/TextInput/TextInput";

export function OptionGroupEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: SettingsOption[];
  onChange: (items: SettingsOption[]) => void;
}) {
  const [newLabel, setNewLabel] = useState("");

  function addItem() {
    const label = newLabel.trim();
    if (!label) return;
    onChange([
      ...items,
      {
        id: uniqueId(label, items.map((item) => item.id)),
        label,
      },
    ]);
    setNewLabel("");
  }

  function deleteItem(item: SettingsOption) {
    const label = item.label.trim() || item.id;
    if (!window.confirm(`Delete "${label}" from ${title}? Existing content using "${item.id}" will keep that saved ID.`)) return;

    onChange(items.filter((option) => option.id !== item.id));
  }

  return (
    <div className="grid gap-5">
      <Panel title={`Add ${title.toLowerCase().replace(/s$/, "")}`}>
        <form
          onSubmit={(event) => { event.preventDefault(); addItem(); }}
          className="grid gap-3"
        >
          <TextInput
            label="Name"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded bg-[#0075de] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005bab]">
              <Save size={16} /> Save
            </button>
            <button
              type="button"
              onClick={() => setNewLabel("")}
              className="inline-flex items-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
            >
              <Plus size={16} /> New
            </button>
          </div>
        </form>
      </Panel>
      <Panel title={title}>
        <div className="grid gap-2">
          {items.map((item) => (
            <div key={item.id} className="grid gap-2 rounded border border-black/10 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="grid gap-1 text-xs font-semibold text-muted">
                {item.id}
                <input
                  value={item.label}
                  onChange={(event) => onChange(items.map((option) => option.id === item.id ? { ...option, label: event.target.value } : option))}
                  onBlur={() => onChange(syncOptionIdToLabel(items, item.id))}
                  className="rounded border border-black/10 bg-white px-2 py-1.5 text-sm font-semibold text-ink"
                />
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => deleteItem(item)}
                  className="inline-flex items-center gap-1 rounded bg-[#fff4eb] px-2 py-1 text-xs font-semibold text-[#b64700] hover:bg-[#ffe7d6]"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
          {!items.length ? <p className="text-sm text-muted">No items yet.</p> : null}
        </div>
      </Panel>
    </div>
  );
}
