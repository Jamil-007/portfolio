"use client";

import { useState } from "react";
import Image from "next/image";
import { FunFactBadge } from "@/components/home/FunFact/FunFact";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function MobileHeroPhoto({
  name,
  photoUrl,
  onFunFactClick,
  showFunFact,
}: {
  name: string;
  photoUrl?: string;
  onFunFactClick: () => void;
  showFunFact: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name);

  return (
    <div className="relative h-full min-h-[180px] md:hidden">
      <FunFactBadge onClick={onFunFactClick} expanded={showFunFact} />
      {photoUrl && !failed ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 768px) 240px, (min-width: 640px) 132px, 104px"
          unoptimized
          onError={() => setFailed(true)}
          className="rounded-lg border border-black/10 object-cover shadow-card"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg border border-black/10 bg-[linear-gradient(135deg,#f6f5f4,#f2f9ff)] text-xl font-bold text-[#615d59] shadow-card">
          {initials || "JO"}
        </div>
      )}
    </div>
  );
}

export function DesktopHeroPhoto({
  name,
  photoUrl,
  onFunFactClick,
  showFunFact,
}: {
  name: string;
  photoUrl?: string;
  onFunFactClick: () => void;
  showFunFact: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name);

  return (
    <div className="hidden w-full max-w-none md:block">
      <div className="relative aspect-[4/5]">
        <FunFactBadge onClick={onFunFactClick} expanded={showFunFact} />
        {photoUrl && !failed ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 320px, 240px"
            unoptimized
            onError={() => setFailed(true)}
            className="rounded-lg border border-black/10 object-cover shadow-card"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-black/10 bg-[linear-gradient(135deg,#f6f5f4,#f2f9ff)] text-6xl font-bold tracking-[-1.5px] text-[#615d59] shadow-card">
            {initials || "JO"}
          </div>
        )}
      </div>
    </div>
  );
}
