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
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const isActive = !!selected && selected !== options[0];

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
        className={`inline-flex h-10 min-w-36 items-center justify-between gap-2 rounded-full border px-4 text-sm font-medium transition sm:min-w-40 ${
          isActive
            ? "border-ink bg-ink text-cream hover:bg-accent hover:border-accent"
            : "border-[rgba(23,23,23,0.2)] bg-paper text-ink hover:border-ink"
        }`}
        onClick={() => {
          setOpen((value) => !value);
          setQuery("");
        }}
      >
        <span className="truncate">{selected?.label ?? "Select"}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="absolute left-0 top-12 z-50 w-64 rounded-lg border border-[rgba(23,23,23,0.12)] bg-cream p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <label className="relative block">
            <span className="sr-only">Search options</span>
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded-full border border-[rgba(23,23,23,0.18)] bg-paper pl-9 pr-3 text-sm text-ink placeholder:text-quiet transition focus:border-ink focus:ring-2 focus:ring-ink/15 focus-visible:[outline:none]"
              autoFocus
            />
          </label>
          <div className="mt-2 max-h-56 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`block w-full rounded-full px-3 py-1.5 text-left text-sm transition hover:bg-black/[0.04] ${
                  option.value === value ? "font-medium text-ink" : "text-muted"
                }`}
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
              <div className="px-3 py-2 font-mono text-xs text-muted">No results</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
