# CLAUDE.md

Guidance for coding agents working in this repository.

## Project Overview

A one-page portfolio for Jamil Orata, built with:

- Next.js App Router
- React and TypeScript
- Tailwind CSS v4 (no JS config — theme tokens live in `src/app/globals.css`)
- HeroUI v3 (`@heroui/react`) for Chip, Card, Button, Link
- `lucide-react` for icons

There is **no CMS, database, admin panel, or API route**. All content lives in
`src/lib/portfolio-data.ts` and is edited directly in code.

The visual design follows `../myportfolio` (a separate repo): four full-height
scroll-snap sections — Intro → Experience → Projects → Connect — with a side dot
nav and a dark mode toggle in the footer. Content comes from Jamil's resume.

## Architecture

- Component-based. `src/app/page.tsx` is a thin shell that renders `PortfolioPage`.
- `src/components/` is grouped by domain:
  ```
  src/components/
  ├── home/     # PortfolioPage (shell), HeroSection, ExperienceSection,
  │             # ProjectsSection, ProjectImageModal, ConnectSection
  └── layout/   # SideNav
  ```
- Naming: PascalCase folder + PascalCase file — `Domain/ComponentName/ComponentName.tsx`.
- A component's folder may contain up to 3 files:
  - `ComponentName.tsx` — UI/rendering only
  - `useComponentName.ts` — hook with state and effects (only for non-trivial logic)
  - `ComponentName.test.ts` — tests (only for hooks and shared utilities)
- **Promotion rule**: a leaf component can live as a single file `Domain/ComponentName.tsx`. Promote to its own folder once you add a hook or test.

## Library Code

- `src/lib/portfolio-data.ts` — **single source of truth for all site content**:
  - `intro` — name, tagline, role/company/period, availability, location, images, `focus[]` chips
  - `experience` — `heading`, `dateRange`, and `items[]` (period, role, company, description, tech)
  - `projects` — `heading`, `dateRange`, and `items[]`
  - `connect` — heading, description, email, `links[]` (GitHub, LinkedIn, …)
  - `footer` — copyright and credit lines
- `src/lib/types.ts` — TypeScript types matching the shape above.

There is **no technology or skill registry**. A project's `tech` is a plain
`string[]` of display labels (`["Next.js", "Python"]`) written on the project
itself. Do not reintroduce id-based lookups, filtering, or a tech/skill modal.

## Data Flow

- `PortfolioPage` imports `portfolioData` directly. No async loading, no fetching.
- The whole site is one statically prerendered route (`/`).
- `usePortfolioPage` owns the two pieces of cross-section state: the `.dark` class
  on `<html>`, and which section is on screen (drives the side-nav dots and the
  one-time fade-in — sections ship as `opacity-0` and an IntersectionObserver adds
  `.animate-fade-in-up`).
- Projects and Experience both render every item in their list with no pager.
  Each list is capped at three entries by hand, because a fourth row no longer
  fits `100dvh`.

## Adding a project

Append an entry to `portfolioData.projects.items`:

```ts
{
  id: "my-thing",
  title: "My Thing",
  subtitle: "One-line category",
  description: "Two sentences, max.",
  image: "/projects/my-thing.png",   // optional; omit for an initials tile
  tech: ["Next.js", "Postgres"],     // plain display labels
  liveUrl: "https://…",              // optional
  repositoryUrl: "https://…",        // optional
}
```

The section renders every item, so keep the list at three. To feature a new
project, swap one out rather than appending a fourth.

`.claude/commands/portfolio-export.md` still exists as a tool to copy into
*other* repos; it writes a `portfolio-export.md` describing that codebase. There
is no longer an `/import-project` command — the data shape is simple enough to
edit by hand.

## Directories of note

- `public/projects/` — project thumbnails (`<id>.png`).
- `public/jamilorata.png` — profile photo.
- `.claude/commands/portfolio-export.md` — source-repo analysis command.

## Testing

- Test framework: Vitest with React Testing Library (not yet installed — add when the first test is written).
- Use TDD for hooks and data transformations (`usePortfolioPage` is the main candidate).
- Skip tests for leaf UI components and simple glue code unless explicitly asked.

## Commands

```bash
npm run dev      # local dev server
npm run lint     # ESLint check (run after code changes)
npm run build    # production build (run when touching data shape or types)
```

No env vars required.

## UI Conventions

- Palette is a neutral off-white / near-black defined as oklch CSS variables in
  `src/app/globals.css` (`--background`, `--foreground`, `--muted-foreground`).
  Dark mode swaps them under `.dark`.
- Typography: Geist Sans (body) and Geist Mono (small uppercase labels like
  `WORK`, `FOCUS`, `ELSEWHERE`, the date range, and `LIVE`/`CODE`), loaded via
  `next/font/google` in `src/app/layout.tsx`. No serif.
- Weights stay light: headings are `font-light`, body is `text-muted-foreground`.
- Borders are hairlines (`border-border`, often at `/50`), corners are `rounded-lg`
  or `rounded-full` for chips.
- Use `lucide-react` icons instead of hand-written SVGs.
- Transitions are slow and quiet — `duration-300` to `duration-500`.
- Respect `prefers-reduced-motion` (already wired in `globals.css`).

### Keeping sections inside one screen

Every section must fit `100dvh` or scroll snapping breaks. `.section-stack`,
`.row-list`, and `.section-row` in `globals.css` set a `min(fixed, dvh)` rhythm
so spacing tightens on short windows; all four sections fit down to ~620px tall.
If you add a row or lengthen a description, re-measure. Note that Tailwind does
not compile arbitrary values containing a bare comma, which is why these are
plain CSS rather than `py-[min(1.25rem,1.9dvh)]`.

### Reveal vs scrollspy

`usePortfolioPage` runs two IntersectionObservers on purpose. Reveal uses
`threshold: 0.01`; scrollspy uses a `-50%` rootMargin band. A single
`threshold: 0.5` observer cannot do both — on a phone the stacked sections are
taller than the viewport, so their ratio never reaches 0.5 and they would stay
stuck at `opacity-0`.

### HeroUI gotcha

HeroUI variant classes can beat Tailwind utilities because they land later in
the stylesheet, not because of class order. `Card variant="transparent"` sets
`border: none`, so `ConnectSection` draws its outline with `ring-1 ring-border`
instead, and `.project-lightbox` (unlayered CSS, so it outranks HeroUI's layered
rule) overrides the modal width — which is capped on `.modal__dialog--lg`, not
the container. If a style silently does nothing, check the variant CSS before
assuming a typo.

## Product Behavior To Preserve

- Four sections, in order: `intro`, `experience`, `projects`, `connect`. The
  `SideNav` ids must stay in sync with the section `id` attributes, and
  `SECTION_COUNT` in `usePortfolioPage` must match.
- Scroll snapping is desktop-only (`min-width: 1024px`). On mobile the sections
  stack and scroll normally so nothing is clipped.
- In the Projects rows, the left column is a **thumbnail image**, not a year.
  This is the one deliberate departure from `../myportfolio`.
- Each project row can show `LIVE` and `CODE` links; both are optional per project.

## Code Style

- Comment the *why*, not the *what*.
- Use named exports over default exports.
- 2-space indentation.

## Editing Guidelines

- Keep changes scoped to the requested behavior.
- Prefer existing components and patterns over new abstractions.
- Don't reintroduce a CMS, database, auth layer, project detail pages, or a
  tech/skill registry unless explicitly asked.
- Do not rewrite unrelated styling or data structures.

## Testing Checklist

After changes, verify `/`:

- Intro — name, tagline, WORK block, FOCUS chips, avatar over the cover banner.
- Experience — three roles with period, company, and tech labels.
- Projects — three rows, no pager. Thumbnails render (a project with no `image`
  falls back to an initials tile), clicking a thumbnail opens the lightbox and
  Escape closes it, LIVE/CODE sit under the thumbnail.
- Connect — email link, social cards, footer, dark mode toggle flips the whole page.
- Side nav dots highlight the section you are on and scroll to it.
- Resize below 1024px: snapping turns off, everything stacks and stays readable.

Minimum check: `npm run lint`. Use `npm run build` for data shape or type changes.
