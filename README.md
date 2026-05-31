# Portfolio

A one-page editorial portfolio for Jamil Orata. Built with Next.js, Tailwind, and a hand-rolled static content model — no CMS, no database, no admin panel.

## Stack

- Next.js (App Router)
- React, TypeScript
- Tailwind CSS
- `lucide-react` for icons
- `react-markdown` + `remark-gfm` for project detail bodies

Fonts (loaded via `next/font/google`): Instrument Serif (display), Geist Sans (body), Geist Mono (labels).

## Content model

All content lives in a single file:

```
src/lib/portfolio-data.ts
```

It exports `portfolioData`, which contains:

- `profile` — name, photo, email, GitHub, LinkedIn
- `favoriteProjectSlug` — points at the one project shown on the homepage as "My favorite project."
- `projects[]` — list of projects (title, slug, descriptions, technologies, skills, links, cover image)
- `technologies[]` — master registry of tech (`id`, `name`, `icon`)
- `skills[]` — master registry of skills (`id`, `name`, `iconKey`)
- `projectTypes[]` — taxonomy (`webApp`, `mobile`, `tool`, `experiment`)

The homepage Toolbox only surfaces tech/skills that appear in at least one project — the master lists are just the metadata registry (id → display info).

## Commands

```bash
npm run dev      # local dev server
npm run lint     # ESLint
npm run build    # production build (full type-check + static generation)
```

No env vars required.

## Project cover images

Save under `public/projects/<slug>.png` (or any image format Next/Image accepts) and reference as `coverImage: "/projects/<slug>.png"` in `portfolio-data.ts`.

## Adding a new project from another codebase

This repo ships two Claude Code slash commands that mechanize the import flow.

### 1. In the source repo

Copy `.claude/commands/portfolio-export.md` from this repo to the source repo's `.claude/commands/` (or install globally to `~/.claude/commands/`). Then run:

```
/portfolio-export
```

It analyzes the codebase (`README`, `package.json`, schemas, deployment configs, git activity) and writes a single `portfolio-export.md` at the source repo's root — entirely from files, no human input required.

### 2. In this repo

Move the generated file into `content/projects/` and run the import command:

```bash
mv /path/to/source/portfolio-export.md "content/projects/<slug>.md"
```

```
/import-project <slug>
```

The command:

- Validates required fields and tech/skill ids
- Appends the new project to `portfolio-data.ts`
- Adds any `newTechnologies` / `newSkills` to the master lists
- Fetches the cover image if it's a URL (saves to `public/projects/<slug>.<ext>`)
- Runs `npm run lint` as a smoke test
- **Never** changes `favoriteProjectSlug` — that's a manual decision

See `content/projects/README.md` for more on the storage convention and `templates/portfolio-project.template.md` for a reference example of an export.

## Directory map

```
src/
├── app/                # routes (App Router)
├── components/
│   ├── home/           # HomePage + favorite/toolbox/contact sections
│   ├── layout/         # SiteHeader, NotFound
│   ├── projects/       # ProjectsPage, ProjectDetailPage, SearchableDropdown
│   └── shared/         # ProjectCard, ProjectRow, TechnologyIcon, SkillPill
└── lib/
    ├── portfolio-data.ts    # ← single source of truth for content
    ├── portfolio-utils.ts   # helpers (projectTypeLabel, skillLabels, …)
    ├── types.ts             # PortfolioData and friends
    └── analytics.ts         # formatLabel

content/projects/        # versioned project export .md files
public/projects/         # cover images for each project
templates/               # reference example of a portfolio-export.md
.claude/commands/        # /portfolio-export, /import-project
```

## Conventions

- Cream `#F5F1EA` background, ink `#171717` text, `#0075de` accent (used sparingly — usually italic serif highlights).
- Pill shapes (`rounded-full`) for chips/buttons, restrained borders, no nested cards.
- Scroll-triggered fade/rise via the `useReveal` hook. Respects `prefers-reduced-motion`.
- 2-space indentation, named exports, comment the *why* not the *what*.
