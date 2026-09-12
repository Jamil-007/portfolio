# Portfolio

A one-page portfolio for Jamil Orata, AI engineer. Four full-height scroll-snap
sections — Intro → Experience → Projects → Connect — with a side dot nav and a
dark mode toggle.

No CMS, no database, no admin panel, no API routes. Everything is one static page.

## Stack

- Next.js (App Router)
- React, TypeScript
- Tailwind CSS v4 — no `tailwind.config.ts`; theme tokens live in `src/app/globals.css`
- HeroUI v3 (`@heroui/react`) — Chip, Card, Button, Link
- `lucide-react` for icons

Fonts (via `next/font/google`): Geist Sans (body), Geist Mono (small uppercase labels).

## Content model

All content lives in a single file:

```
src/lib/portfolio-data.ts
```

It exports `portfolioData` with five keys:

| Key        | Holds                                                                      |
| ---------- | -------------------------------------------------------------------------- |
| `intro`    | name, tagline, role/company/period, availability, location, images, `focus[]` chips |
| `experience` | section `heading`, `dateRange`, and `items[]` (period, role, company, description, tech) |
| `projects` | section `heading`, `dateRange`, and `items[]`                               |
| `connect`  | heading, description, email, `links[]` (GitHub, LinkedIn, …)                |
| `footer`   | copyright and credit lines                                                  |

There is no technology or skill registry. A project's `tech` is a plain array of
display strings written on the project itself.

## Adding a project

1. Drop a thumbnail at `public/projects/<id>.png` (optional — a project with no
   `image` renders an initials tile instead).
2. Append to `portfolioData.projects.items`:

```ts
{
  id: "my-thing",
  title: "My Thing",
  subtitle: "One-line category",
  description: "Two sentences, max.",
  image: "/projects/my-thing.png",   // optional
  tech: ["Next.js", "Postgres"],
  liveUrl: "https://…",          // optional
  repositoryUrl: "https://…",    // optional
}
```

Projects paginate 3 per page automatically. Keep descriptions to about three
lines — each section has to fit one screen for scroll snapping to work.

## Commands

```bash
npm run dev      # local dev server
npm run lint     # ESLint
npm run build    # production build (full type-check + static generation)
```

No env vars required.

## Directory map

```
src/
├── app/
│   ├── layout.tsx       # fonts + metadata
│   ├── page.tsx         # renders PortfolioPage
│   └── globals.css      # Tailwind v4 theme tokens, snap + animation utilities
├── components/
│   ├── home/
│   │   ├── PortfolioPage/    # client shell: dark mode + section observer
│   │   ├── HeroSection/
│   │   ├── ExperienceSection/
│   │   ├── ProjectsSection/     # + useProjectsSection (pagination)
│   │   ├── ProjectImageModal/   # clickable thumbnail -> lightbox
│   │   └── ConnectSection/
│   └── layout/
│       └── SideNav/
└── lib/
    ├── portfolio-data.ts     # ← single source of truth for content
    └── types.ts

public/projects/         # project thumbnails
public/cover.jpg         # hero banner graphic
.claude/commands/        # /portfolio-export (for use in *other* repos)
```

## Conventions

- Neutral off-white / near-black palette as oklch CSS variables; `.dark` swaps them.
- Light weights, hairline borders, `rounded-lg` cards and `rounded-full` chips.
- Slow, quiet transitions (`duration-300`–`duration-500`). Respects `prefers-reduced-motion`.
- Scroll snapping is desktop-only (≥1024px); mobile stacks and scrolls normally.
- 2-space indentation, named exports, comment the *why* not the *what*.
