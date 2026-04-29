"use client";

import { Code2 } from "lucide-react";

const technologyIconUrls: Record<string, string> = {
  "docker": "https://cdn.simpleicons.org/docker/2496ED",
  "fastapi": "https://cdn.simpleicons.org/fastapi/009688",
  "firebase": "https://cdn.simpleicons.org/firebase/FFCA28",
  "gcp": "https://cdn.simpleicons.org/googlecloud/4285F4",
  "gitlab": "https://cdn.simpleicons.org/gitlab/FC6D26",
  "github": "https://cdn.simpleicons.org/github/181717",
  "google cloud": "https://cdn.simpleicons.org/googlecloud/4285F4",
  "langchain": "https://cdn.simpleicons.org/langchain/1C3C3C",
  "next.js": "https://cdn.simpleicons.org/nextdotjs/000000",
  "python": "https://cdn.simpleicons.org/python/3776AB",
  "tailwind css": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "typescript": "https://cdn.simpleicons.org/typescript/3178C6",
};

export function TechnologyIcon({ name, icon, onClick }: { name: string; icon?: string; onClick?: () => void }) {
  const iconUrl = icon || technologyIconUrls[name.toLowerCase()];

  return (
    <button
      type="button"
      aria-label={name}
      title={name}
      onClick={onClick}
      className="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-ink shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-[#0075de]/40 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2"
    >
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt="" className="h-5 w-5 shrink-0 object-contain" />
      ) : (
        <Code2 size={17} className="shrink-0 text-[#0075de]" />
      )}
      {name}
    </button>
  );
}
