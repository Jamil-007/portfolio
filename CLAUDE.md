# CLAUDE.md

Guidance for coding agents working in this repository.

## Project Overview

A one-page editorial portfolio for Jamil Orata, built with:

- Next.js App Router
- React and TypeScript
- Tailwind CSS

There is **no CMS, database, or admin panel**. All content (projects, profile, tech, skills) lives in a single TypeScript module at `src/lib/portfolio-data.ts` and is edited directly in code — typically via Claude Code.

## Architecture

- Component-based. Pages (`src/app/<route>/page.tsx`) are thin shells that compose components from `src/components/`.
- `src/components/` is grouped by domain:
  ```
  src/components/
  ├── home/       # HomePage + RelatedProjectsModal + UseReveal hook
  ├── layout/     # SiteHeader, NotFound
  ├── projects/   # ProjectsPage, ProjectDetailPage, SearchableDropdown
  └── shared/     # TechnologyIcon, SkillPill, ProjectCard, ProjectRow
  ```
- Naming: PascalCase folder + PascalCase file — `Domain/ComponentName/ComponentName.tsx`.
- A component's folder may contain up to 3 files:
  - `ComponentName.tsx` — UI/rendering only
  - `useComponentName.ts` — hook with state and effects (only for non-trivial logic)
  - `ComponentName.test.ts` — tests (only for hooks and shared utilities)
- **Promotion rule**: a leaf component can live as a single file `Domain/ComponentName.tsx`. Promote to its own folder once you add a hook or test.

## Library Code

- `src/lib/` holds shared utilities, types, and the static content module.
- `src/lib/portfolio-data.ts` — **single source of truth for all portfolio content**:
  - `profile` (name, photo, email, github, linkedin)
  - `favoriteProjectSlug` — names the project shown on the homepage as "My favorite project."
  - `projects[]` (each with `id`, `slug`, `title`, `type`, `shortDescription`, `longDescription`, `technologies`, `skills`, `repositoryUrl`, `liveUrl`, `coverImage`)
  - `technologies[]` — master registry (`id`, `name`, `icon`)
  - `skills[]` — master registry (`id`, `name`, `iconKey`)
  - `projectTypes[]` — taxonomy
- `src/lib/types.ts` — TypeScript types matching the shape above.
- `src/lib/portfolio-utils.ts` — helpers: `projectTypeLabel`, `projectTypesWithUsedValues`, `projectMatchesSkill`, `skillLabels`.
- `src/lib/analytics.ts` — small `formatLabel` helper.

## Data Flow

- Public pages import `portfolioData` directly. No async loading, no subscriptions.
- `/projects/[slug]` uses `generateStaticParams` from `portfolioData.projects` so every detail page is statically generated at build time.
- The homepage Toolbox auto-filters the master `technologies` and `skills` arrays down to only those used by at least one project — the master lists are the metadata registry, not the display list.
- The homepage "My favorite project." section looks up `projects.find(p => p.slug === data.favoriteProjectSlug)`.

## Adding new projects

Two Claude Code slash commands automate the import flow:

### `/portfolio-export` (runs in a source repo)

Lives at `.claude/commands/portfolio-export.md` in this repo — meant to be copied into each source repo's `.claude/commands/` (or installed globally at `~/.claude/commands/`). Analyzes the source codebase from files only (`README`, `package.json`, schemas, deployment configs, git history) and writes a `portfolio-export.md` at the source repo's root.

### `/import-project` (runs in this repo)

Lives at `.claude/commands/import-project.md`. Takes a path or a slug, validates the file, then:

- Appends the new project entry to `portfolio-data.ts`
- Adds any `newTechnologies` / `newSkills` to the master arrays
- Fetches the cover image to `public/projects/<slug>.<ext>` if it's a URL
- Moves the source `.md` into `content/projects/<slug>.md`
- Runs `npm run lint`
- **Never** changes `favoriteProjectSlug` — that's a manual decision the user makes explicitly.

The full workflow is documented in `README.md` and `content/projects/README.md`.

## Directories of note

- `content/projects/` — versioned `.md` files for every imported project (named by slug). Edits here are the audit trail for what's in `portfolio-data.ts`.
- `public/projects/` — cover images (`<slug>.png` or similar).
- `templates/portfolio-project.template.md` — reference example of a finished export.
- `.claude/commands/` — the two slash commands described above.

## Testing

- Test framework: Vitest with React Testing Library (not yet installed — add when the first test is written).
- Use TDD for hooks, utilities, and data transformations.
- Skip tests for leaf UI components and simple glue code unless explicitly asked.

## Commands

```bash
npm run dev      # local dev server
npm run lint     # ESLint check (run after code changes)
npm run build    # production build (run when touching routing, data shape, or types)
```

No env vars required.

## Architecture Notes

- One-page homepage composition: `src/components/home/HomePage/HomePage.tsx` — Hero → Toolbox → Favorite project → Contact.
- Project archive: `src/components/projects/ProjectsPage/ProjectsPage.tsx` (uses `ProjectCard`). Search + collapsible filters (type / tech / skill).
- Project detail: `src/components/projects/ProjectDetailPage/ProjectDetailPage.tsx` (renders markdown via `react-markdown`).
- Homepage favorite tile: `src/components/shared/ProjectRow/ProjectRow.tsx`.
- Site header (avatar button + photo modal, name link, Projects, Get in touch): `src/components/layout/SiteHeader/SiteHeader.tsx`.
- Tech/Skill modal: `src/components/home/RelatedProjectsModal/RelatedProjectsModal.tsx`. Click a Tech or Skill chip on the homepage → modal lists the projects that use it; each row is clickable to the project detail page.

## Product Behavior To Preserve

- "My favorite project." surfaces the project whose slug equals `favoriteProjectSlug`. No per-project `featured` flag exists — the favorite is decided at the top level of the data file.
- Every project in `portfolioData.projects` is published. There is no `visibility` field — exclude a project by removing it from the array.
- Toolbox section: search box filters both Tech and Skills lists by name as you type. The Tech and Skills shown are only those used by at least one project.
- Site header avatar is a button — clicking opens a modal with the larger circular photo and a short greeting.

## UI Conventions

- Visual system is editorial: cream `#F5F1EA` background, ink `#171717` text, `#0075de` as the accent (used sparingly — usually italic serif highlights).
- Typography: Instrument Serif (display), Geist Sans (body), Geist Mono (labels) — loaded via `next/font/google` in `src/app/layout.tsx`.
- Use `lucide-react` icons instead of custom SVGs when an icon exists.
- Cards/buttons: pill shapes (`rounded-full`), restrained borders, no nested cards.
- Motion: scroll-driven fade/rise (see `useReveal` hook). Respect `prefers-reduced-motion` (already wired via `globals.css`).

## Code Style

- Comment the *why*, not the *what*.
- Use named exports over default exports.
- 2-space indentation.

## Workflow

- For non-trivial requests, ask clarifying questions about edge cases before implementing.
- For content changes (adding a project, updating bio, swapping a skill icon): edit `src/lib/portfolio-data.ts` directly OR use `/import-project` if the change comes from a `portfolio-export.md`. Always run `npm run lint` after.

## Editing Guidelines

- Keep changes scoped to the requested behavior.
- Prefer existing components and patterns over new abstractions.
- Don't reintroduce a CMS, database, or auth layer unless explicitly asked.
- Do not rewrite unrelated styling or data structures.

## Testing Checklist

After changes, verify the relevant pages:

- `/` — hero, toolbox (with search, only used tech/skills visible), favorite project, contact, tech/skill modal.
- `/projects` — search, collapsible filter panel, project cards.
- `/projects/[slug]` — renders the markdown long description, Live + Repo links.

Minimum check: `npm run lint`. Use `npm run build` for routing, data shape, or type-level changes.
