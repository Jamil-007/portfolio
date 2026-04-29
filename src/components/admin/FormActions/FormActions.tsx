import { Plus, Save } from "lucide-react";

export function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="inline-flex items-center gap-2 rounded bg-[#0075de] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005bab]">
        <Save size={16} /> Save
      </button>
      <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]">
        <Plus size={16} /> New
      </button>
    </div>
  );
}
