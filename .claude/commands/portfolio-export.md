---
description: Analyze this codebase and write a portfolio-export.md file describing it for Jamil's portfolio site.
allowed-tools: Bash, Read, Glob, Grep, Write
---

You are generating a `portfolio-export.md` file that describes **this codebase** in a format Jamil's portfolio site can consume.

The portfolio lives at `github.com/Jamil-007/portfolio`. Its content model is a single TypeScript file. This export becomes the source of one new project entry.

## Hard rules

1. **Codebase only.** Do not invent timelines, team sizes, roles, costs, MAU, or anything else that isn't derivable from files in this repo. If a fact isn't in the codebase, omit it — do not guess.
2. **No marketing voice.** Write like a senior engineer documenting reality. Concrete, specific, no superlatives.
3. **List, don't filter.** Enumerate every load-bearing tech and every skill the codebase demonstrates. The portfolio's import step decides what's already in the master registry and what's new — that's not your job here.
4. **Output exactly one file:** `portfolio-export.md` at the repo root. No extra files, no console summary beyond a one-line confirmation.

## Step 1 — Gather inputs

Read (only if they exist):

- `README.md` and any other `*.md` at the root
- `package.json`, `tsconfig.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`
- `.env.example` (NOT `.env` or `.env.local` — never read secrets)
- `prisma/schema.prisma`, `drizzle/**/*.ts`, `migrations/*.sql`, `db/schema.*`
- `Dockerfile`, `docker-compose.yml`, `vercel.json`, `railway.toml`, `fly.toml`, `netlify.toml`
- `.github/workflows/*.yml`, `.gitlab-ci.yml`
- `src/app/api/**`, `src/server/**`, `pages/api/**`, `app/**/route.ts`, `routes/**`
- `middleware.ts`, top-level config files
- The first level of `src/` (or equivalent) and `docs/` to understand structure

Run, capturing output:

- `git remote get-url origin`
- `git log -1 --format=%ai`
- `git rev-list --count HEAD`
- `git ls-files | awk -F. '{print $NF}' | sort | uniq -c | sort -rn | head -10` (file-extension histogram)
- `ls public/ docs/ 2>/dev/null` to find media

Do **not** read large vendored directories (`node_modules`, `.next`, `dist`, `build`, `__pycache__`, `target`, `vendor`).

## Step 2 — Derive the fields

### Identity
- `title` — display version of `package.json` name, falling back to README h1
- `slug` — `title` lower-cased, non-alphanum → `-`, collapse and trim hyphens
- `type` — pick one and ONLY one of `webApp | mobile | tool | experiment`:
  - Next.js / Remix / SvelteKit / Astro / Vite-React → `webApp`
  - React Native / Expo / Flutter → `mobile`
  - CLI tool / script / library → `tool`
  - Otherwise → `experiment`
- `repositoryUrl` — from `git remote get-url origin` (normalize `git@` → `https://`)
- `liveUrl` — from `package.json` `homepage`, README badges, `vercel.json` aliases. Empty if not deployed.
- `coverImage` — first match: `public/og.png`, `public/og-image.*`, `public/cover.*`, `docs/cover.*`, README hero image. Use the local repo path.

### Descriptions
- `shortDescription` — 1–2 sentences. Prefer the first non-trivial paragraph of README. Otherwise `package.json` `description`. Strip badge/install/license boilerplate.
- Long description goes in the **body** of the .md (everything after the frontmatter), structured under section headings (see Step 3).

### Technologies — list **everything load-bearing**

Enumerate the tech this project actually uses. *Include:* frameworks, runtimes, languages, databases, ORMs, auth providers, AI/ML providers, payment/email/storage SaaS, deployment platforms, notable UI libraries (Tailwind, shadcn). *Skip:* generic utility libraries (lodash, date-fns, clsx, classnames, zod, etc.) and dev-only tooling unless it's central to the project's identity.

For each, output an object:

```yaml
- name: Next.js
  icon: https://cdn.simpleicons.org/nextdotjs/000000
```

- `name` — human display name (e.g., `Next.js`, `Python`, `PostgreSQL`).
- `icon` — SimpleIcons URL when one exists for this tech. Format: `https://cdn.simpleicons.org/<simpleicons-slug>/<6-char-hex>`. Pick a reasonable brand hex (or `000000` if unsure). Omit the field if no SimpleIcons slug fits.

Do not try to map to any existing portfolio id. Do not guess at internal slugs. Just list the tech honestly. The portfolio's `/import-project` command handles registry matching.

Common simpleicons slugs you can use without checking: `nextdotjs, react, vuedotjs, svelte, astro, vite, nodedotjs, python, typescript, javascript, html5, css, postgresql, mysql, mongodb, redis, sqlite, supabase, prisma, vercel, cloudflare, aws, googlecloud, docker, kubernetes, github, gitlab, openai, anthropic, langchain, stripe, clerk, resend, tailwindcss, fastapi, django, flask, rust, go, leaflet`. Use neutral hex (`000000`) if you're not sure of brand colour.

**Watch out:** SimpleIcons retired some old aliases. Use `css` (not `css3`). HTML stays as `html5`.

### Skills — list **what the codebase demonstrates**

Enumerate the engineering skills this project shows evidence of. Be specific. For each:

```yaml
- name: AI Integration
  evidence: Uses OpenAI GPT-4o for chat completion and text-embedding-3-large for RAG
```

- `name` — human display name (e.g., `AI Integration`, `Full-stack Apps`, `Database Design`, `Cloud Deployment`, `API Development`, `Automation`, `Real-time Systems`).
- `evidence` — one short sentence pointing at the concrete file/dependency/pattern that justifies the claim.

Don't try to map to existing portfolio skill ids. List the skills the codebase actually demonstrates.

### Activity
- `lastCommit` — output of `git log -1 --format=%ai` truncated to YYYY-MM-DD
- `commitCount` — output of `git rev-list --count HEAD`
- `primaryLanguage` — top extension from the histogram, mapped (ts/tsx → TypeScript, js/jsx → JavaScript, py → Python, etc.)

## Step 3 — Write the file

Output `portfolio-export.md` with this exact shape — YAML frontmatter then markdown body:

```markdown
---
title: <Display Name>
slug: <slug>
type: <webApp|mobile|tool|experiment>
repositoryUrl: <url>
liveUrl: <url-or-empty>
coverImage: <repo-relative-path-or-url>

shortDescription: >
  <one or two sentences>

technologies:
  - name: <Display Name>
    icon: <simpleicons-url-or-omit-field>
  - name: <...>

skills:
  - name: <Display Name>
    evidence: <short sentence>
  - name: <...>

activity:
  lastCommit: <YYYY-MM-DD>
  commitCount: <int>
  primaryLanguage: <Name>
---

## What it is
<one paragraph from README + entry-point inspection>

## System overview
<1–2 paragraphs on how the pieces fit, then a code block showing one
request lifecycle, then a bullet list of deployment topology>

## Tech stack
<a table with columns: Layer | Choice | From | Notes>

## Key features
<bullet list — from README features, falling back to inferring from
route names + page titles>

## API surface
<code block listing the actual endpoints found in code; omit section
entirely if there are none>

## Data model
<code block — paste the schema verbatim from prisma/drizzle/sql; omit
section entirely if there is no schema>

## External integrations
<bullet list — name each integration, the env-var keys it uses, and the
purpose>

## Background work
<bullet list of crons/queues/workers; omit section if none>

## Operations
<bullet list covering CI/CD, deploy method, error tracking, env vars,
container setup — whichever apply>

## Screenshots
<bullet list of every image found in public/ or docs/ that looks like a
screenshot or hero shot, with the repo-relative path>
```

Omit any section (other than the frontmatter) that has no content. Do not write "N/A" or "none" — just leave the section out.

## Step 4 — Confirm

After writing the file, output a single line: `Wrote portfolio-export.md (<N> bytes).`

Begin.
