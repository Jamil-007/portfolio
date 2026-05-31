"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

export function SiteHeader({
  email,
  currentPath,
  photoUrl,
  name,
}: {
  email?: string;
  currentPath?: string;
  photoUrl?: string;
  name?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!photoOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhotoOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [photoOpen]);

  const onProjects = currentPath?.startsWith("/projects");
  const displayName = name || "Jamil Orata";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-cream/85 backdrop-blur-md border-b border-[rgba(23,23,23,0.08)]" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between gap-6 sm:h-20">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label={`View ${displayName}'s photo`}
              onClick={() => setPhotoOpen(true)}
              className="relative h-8 w-8 overflow-hidden rounded-full bg-paper ring-1 ring-[rgba(23,23,23,0.12)] transition hover:ring-ink/40 sm:h-9 sm:w-9"
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={displayName}
                  fill
                  sizes="36px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-serif text-[13px] text-quiet">
                  {initials || "JO"}
                </span>
              )}
            </button>
            <Link href="/" className="group flex items-baseline gap-1.5">
              <span className="font-serif text-2xl leading-none tracking-tightish text-ink sm:text-[26px]">
                Jamil
              </span>
              <span className="font-serif italic text-2xl leading-none text-muted/80 transition-colors group-hover:text-accent sm:text-[26px]">
                Orata
              </span>
            </Link>
          </div>
          <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/projects"
              className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium tracking-tight transition sm:px-4 sm:text-sm ${
                onProjects ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <span>Projects</span>
              {onProjects ? (
                <span className="absolute left-1/2 -bottom-0.5 h-px w-5 -translate-x-1/2 bg-ink" />
              ) : null}
            </Link>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-cream transition hover:bg-accent sm:px-4 sm:text-sm"
              >
                <span>Get in touch</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </nav>
        </div>
      </header>

      {photoOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${displayName} photo`}
          onClick={() => setPhotoOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 px-6 backdrop-blur-md"
        >
          <button
            type="button"
            aria-label="Close photo"
            onClick={() => setPhotoOpen(false)}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-ink shadow-card transition hover:bg-cream"
          >
            <X size={18} />
          </button>
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex flex-col items-center gap-7 animate-rise-in"
          >
            <div className="relative h-[min(64vw,360px)] w-[min(64vw,360px)] overflow-hidden rounded-full bg-paper ring-1 ring-cream/30 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={displayName}
                  fill
                  sizes="360px"
                  unoptimized
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-[120px] text-quiet">
                  {initials || "JO"}
                </div>
              )}
            </div>
            <div className="max-w-md text-center">
              <p className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] leading-tight text-cream">
                Hi, I&apos;m Jamil <span className="serif-italic text-cream/80">— glad you stopped by.</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
