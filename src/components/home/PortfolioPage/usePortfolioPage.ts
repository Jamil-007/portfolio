"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_COUNT = 4;

/**
 * Owns the two bits of cross-section state: the dark-mode class on <html>,
 * and which section is currently on screen (drives the side-nav dots).
 *
 * Reveal and scrollspy need different observers. A single `threshold: 0.5`
 * observer cannot do both: on a phone the stacked sections are far taller than
 * the viewport, so their intersection ratio never reaches 0.5 and they would
 * stay stuck at `opacity-0` forever.
 */
export function usePortfolioPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const sectionsRef = useRef<(HTMLElement | null)[]>(Array(SECTION_COUNT).fill(null));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const sections = sectionsRef.current.filter((el): el is HTMLElement => el !== null);

    // Reveal: any sliver on screen is enough, so height never matters. Each
    // section is unobserved once shown — the rise-in only ever plays once.
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("animate-fade-in-up");
          reveal.unobserve(entry.target);
        });
      },
      { threshold: 0.01 }
    );

    // Scrollspy: the shrunken root is a single horizontal line across the
    // middle of the viewport, so whichever section covers that line is active
    // regardless of how tall it is.
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      reveal.observe(section);
      spy.observe(section);
    });

    return () => {
      reveal.disconnect();
      spy.disconnect();
    };
  }, []);

  const registerSection = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionsRef.current[index] = el;
    },
    []
  );

  return {
    isDark,
    toggleTheme: () => setIsDark((value) => !value),
    activeSection,
    registerSection,
  };
}
