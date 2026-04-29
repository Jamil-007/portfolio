"use client";

import { Bot, BriefcaseBusiness, Cloud, Code2, Database, GitBranch, Layers3, Sparkles, Wrench } from "lucide-react";

export const skillIconMap = { Bot, BriefcaseBusiness, Cloud, Code2, Database, GitBranch, Layers3, Sparkles, Wrench };

export function SkillPill({ name, icon: Icon, onClick }: { name: string; icon: typeof Code2; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-ink shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-[#0075de]/40 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
    >
      <Icon size={17} className="text-[#0075de]" />
      {name}
    </button>
  );
}
