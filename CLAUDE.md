# CLAUDE.md

Guidance for coding agents working in this repository.

## Project Overview

This is a Firebase-backed portfolio built with:

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Firebase Auth and Cloud Firestore

Both the public site and the admin dashboard require Firebase configuration. When Firebase is unavailable the app renders empty content (no demo fallback). The admin dashboard additionally requires admin auth.

## Architecture

- Component-based architecture. Pages (`src/app/<route>/page.tsx`) are thin shells that compose components from `src/components/`.
- `src/components/` is grouped by domain. Each domain folder contains components used in that area:
  ```
  src/components/
  ├── admin/      # AdminDashboard, ProjectsAdmin, ProfileAdmin, primitives (Panel, Modal, TextInput, ...)
  ├── blog/       # BlogPage, BlogPostPage
  ├── home/       # HomePage, HeroPhoto, FunFact, RelatedProjectsModal
  ├── layout/     # NavPill, ChatbotPreview, BackHomeLink, NotFound
  ├── login/      # LoginPage
  ├── projects/   # ProjectCard, ProjectsPage, ProjectDetailPage, SearchableDropdown, InfoBlock
  └── shared/     # Badge, TechnologyIcon, SkillPill (used across domains)
  ```
- A `ui/` folder is reserved for shadcn primitives if shadcn is added later. None today — hand-rolled inputs/modals live in their domain folder (e.g. `admin/TextInput`, `admin/Modal`).
- Naming: PascalCase folder + PascalCase file — `Domain/ComponentName/ComponentName.tsx`.
- A component's folder may contain up to 3 files:
  - `ComponentName.tsx` — UI/rendering only
  - `useComponentName.ts` — hook with state and effects (only when the component has non-trivial logic; pure presentational components don't need one)
  - `ComponentName.test.ts` — tests (only for hooks and shared utilities; skip for leaf UI)
- **Promotion rule**: a leaf component can live as a single file `Domain/ComponentName.tsx` at the domain root. Promote it to its own folder once you add a hook or a test. Don't pre-create empty folders.
- Page-specific components that are genuinely single-use can go in `src/app/<page>/_components/`, but prefer `src/components/<domain>/` since most things get reused eventually.

## Library Code

- `src/lib/` holds shared utilities, types, and the Firestore data layer.
- Today everything in `src/lib/` runs in the browser (Firebase client SDK + `onSnapshot` real-time subscriptions). When server-side code is introduced (Firebase Admin SDK, API routes), split into `lib/server/`, `lib/client/`, and `lib/shared/` at that point — not before. Don't add the directories speculatively.

## Testing

- Test framework: Vitest with React Testing Library (not yet installed — add when the first test is written).
- Use TDD for hooks, utilities, and data transformations: write the failing test first, then implement.
- Skip tests for leaf UI components and simple glue code unless explicitly asked.
- Show the test alongside the implementation, not in a separate step.

## Commands

```bash
npm run dev      # local dev server
npm run lint     # ESLint check (run after code changes)
npm run build    # production build (run when touching routing, data loading, or shared types)
```

## Architecture Notes

- Public page composition: `src/components/home/HomePage/HomePage.tsx`. Other public pages live in `blog/`, `projects/`.
- Project cards: `src/components/projects/ProjectCard/ProjectCard.tsx`, reused across the homepage, `/projects`, and related-project modals.
- Admin CRUD UI: `src/components/admin/AdminDashboard/AdminDashboard.tsx` and the per-tab admins (`ProjectsAdmin`, `BlogAdmin`, `ProfileAdmin`, `LibraryAdmin`).
- Firestore subscriptions and write helpers: `src/lib/firestore-data.ts`.
- Shared data types: `src/lib/types.ts`.
- Empty initial state: `src/lib/empty-data.ts` (used as React initial state and as the no-Firebase placeholder).
- Public data utilities (`projectMatchesSkill`, `settingsOptionLabel`, etc.): `src/lib/portfolio-utils.ts`.
- Settings normalization, slug helpers, etc.: `src/lib/settings-utils.ts`.

Public data flow:

- `subscribeToPortfolioData` reads published projects, published blog posts, technologies, and profile content.
- If Firebase is unavailable, the app renders empty content.

Admin data flow:

- `subscribeToAdminData` reads all projects, blog posts, technologies, and profile content.
- Save/delete helpers in `src/lib/firestore-data.ts` perform Firestore writes.

## Product Behavior To Preserve

- Homepage `My Favorite Projects` is driven by published projects where `project.featured === true`.
- Admin project "Favorite" UI saves to the existing `featured` field.
- Draft projects should not appear publicly even if favorited.
- Tech and Skills sections on the homepage are connected to projects:
  - Tech matches project `technologies`.
  - Skills use `projectMatchesSkill` from `src/lib/portfolio-utils.ts`.
- Project cards show a promotional image front, flip to details, and show `Live` / `Repo` links below the always-visible title area.
- Project filter dropdowns on `/projects` should close on outside click and Escape.

## UI Conventions

- Keep the visual system clean, quiet, and Notion-inspired.
- Use `#0075de` as the main interactive accent.
- Prefer subtle borders, restrained shadows, white surfaces, and compact rounded controls.
- Use `lucide-react` icons instead of custom SVGs when an icon exists.
- Keep cards at modest radius and avoid nested card layouts.
- Search bars and pagination controls should match the existing compact blue rounded style.
- Preserve mobile bottom spacing so the fixed nav pill does not hide content.

## Code Style

- Comment the *why*, not the *what*.
  Good: `// Debounce to avoid hammering the API on every keystroke`
  Bad: `// Set loading to true`
- Use named exports over default exports.
- Indentation matches the project's existing files (2-space).

## Workflow

- Before implementing, ask clarifying questions about requirements, edge cases, or ambiguous behavior. Don't ask about things you can reasonably infer.

## Editing Guidelines

- Keep changes scoped to the requested behavior.
- Prefer existing components and patterns over new abstractions.
- Avoid schema migrations unless the request truly needs new persisted data.
- When a UI rename can map to an existing field, keep the existing field name. Example: admin "Favorite" maps to `featured`.
- Do not rewrite unrelated styling or data structures.

## Testing Checklist

After changes, verify the relevant pages:

- `/` — hero, tech, skills, favorite projects, nav pill, AI button.
- `/projects` — dropdown filters, search, pagination, project cards.
- `/blog` — blog search and pagination.
- `/admin` — content editing flows (requires Firebase).

Minimum check: `npm run lint`. Use `npm run build` for routing, Firestore, schema, or type-level changes.
