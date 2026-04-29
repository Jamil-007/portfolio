export function LibraryCard({ title, count, description, onClick }: { title: string; count: number; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-36 gap-3 rounded border border-black/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#0075de]/40 hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)] focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <span className="rounded-full bg-[#eef7ff] px-2 py-1 text-xs font-bold text-[#0075de]">{count}</span>
      </div>
      <p className="text-sm leading-6 text-muted">{description}</p>
    </button>
  );
}
