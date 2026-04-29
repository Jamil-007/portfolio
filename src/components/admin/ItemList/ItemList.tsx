"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";

export function ItemList<T extends { id: string }>({
  items,
  primary,
  secondary,
  adornment,
  emptyLabel = "No items yet.",
  onEdit,
  onDelete,
}: {
  items: T[];
  primary: (item: T) => string;
  secondary?: (item: T) => string;
  adornment?: (item: T) => React.ReactNode;
  emptyLabel?: string;
  onEdit: (item: T) => void;
  onDelete: (item: T) => Promise<void>;
}) {
  const sorted = useMemo(() => [...items].sort((a, b) => primary(a).localeCompare(primary(b))), [items, primary]);

  return (
    <div className="grid gap-3">
      {sorted.map((item) => (
        <div key={item.id} className="rounded border border-black/10 bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-bold text-ink">{primary(item)}</div>
            {adornment?.(item)}
          </div>
          {secondary ? <div className="mt-1 text-sm text-muted">{secondary(item)}</div> : null}
          <div className="mt-3 flex gap-2">
            <button onClick={() => onEdit(item)} className="rounded border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-black/[0.03]">
              Edit
            </button>
            <button onClick={() => onDelete(item)} className="inline-flex items-center gap-1 rounded bg-[#fff4eb] px-3 py-1.5 text-sm font-semibold text-[#b64700] hover:bg-[#ffe7d6]">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ))}
      {!items.length ? <p className="text-sm text-muted">{emptyLabel}</p> : null}
    </div>
  );
}
