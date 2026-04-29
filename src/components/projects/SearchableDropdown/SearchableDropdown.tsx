"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export function SearchableDropdown({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeDropdown() {
      setOpen(false);
      setQuery("");
    }

    function handlePointerDown(event: PointerEvent) {
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }

      closeDropdown();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDropdown();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        className="inline-flex h-8 min-w-36 items-center justify-between gap-2 rounded-full border border-[#0075de] bg-white px-3 text-xs font-semibold text-ink transition hover:bg-[#f2f9ff] sm:min-w-40"
        onClick={() => {
          setOpen((value) => !value);
          setQuery("");
        }}
      >
        <span>{selected?.label ?? "Select"}</span>
        <ChevronDown size={14} className={`text-[#0075de] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute left-0 top-10 z-50 w-56 rounded-lg border border-black/10 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          <label className="relative block">
            <span className="sr-only">Search options</span>
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0075de]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-8 w-full rounded-full border border-[#0075de] bg-white pl-8 pr-3 text-xs font-semibold text-ink outline-none placeholder:text-muted"
              autoFocus
            />
          </label>
          <div className="mt-2 max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`block w-full rounded px-3 py-2 text-left text-xs font-semibold transition hover:bg-[#f2f9ff] ${option.value === value ? "text-[#0075de]" : "text-ink"}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {option.label}
              </button>
            ))}
            {!filteredOptions.length ? (
              <div className="px-3 py-2 text-xs font-semibold text-muted">No results</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
