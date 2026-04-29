import { X } from "lucide-react";

export function Modal({
  title,
  action,
  children,
  onClose,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/35 p-4">
      <section className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold tracking-[-0.25px] text-ink">{title}</h2>
          <div className="flex flex-wrap gap-2">
            {action}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/[0.03]"
            >
              <X size={16} /> Close
            </button>
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
