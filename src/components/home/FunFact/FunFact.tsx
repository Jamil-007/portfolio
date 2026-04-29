"use client";

import { Sparkles, X } from "lucide-react";

export function FunFactBadge({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="absolute -right-2 -top-2 z-10 rounded-full bg-[#f2f9ff]/95 px-2 py-1 text-[10px] font-bold text-[#097fe8] shadow-card ring-1 ring-black/10 hover:bg-[#e5f3ff] sm:-right-3 sm:-top-3 sm:px-2.5 sm:text-xs"
    >
      Fun Fact
    </button>
  );
}

export function FunFactModal({ funFact, onClose }: { funFact: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fun-fact-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-lg border border-[#0075de]/30 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18),0_0_42px_rgba(0,117,222,0.2)] before:absolute before:-right-16 before:-top-16 before:h-36 before:w-36 before:rounded-full before:bg-[#0075de]/10 before:content-[''] after:absolute after:-bottom-20 after:left-8 after:h-32 after:w-32 after:rounded-full after:bg-[#ffca28]/20 after:content-['']"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close fun fact"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-black/[0.05] hover:text-ink"
        >
          <X size={18} />
        </button>
        <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f9ff] text-[#0075de] shadow-[0_0_24px_rgba(0,117,222,0.22)]">
          <Sparkles size={24} />
        </div>
        <h2 id="fun-fact-title" className="text-[32px] font-bold leading-none text-ink">
          Fun Fact
        </h2>
        <p className="mt-4 text-lg font-semibold leading-7 text-muted">
          {funFact}
        </p>
      </div>
    </div>
  );
}
