---
description: Import a portfolio-export.md into src/lib/portfolio-data.ts, registering any new tech/skills automatically.
argument-hint: <path-to-md OR slug>
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

You are importing a `portfolio-export.md` produced by `/portfolio-export` in a source repo. The argument may be:

- a path to an `.md` file (e.g., `content/projects/foo.md` or `~/Downloads/portfolio-export.md`), or
- a bare slug (e.g., `foo`) — resolve it to `content/projects/<slug>.md`.

The argument is: `$ARGUMENTS`

## Step 1 — Locate and read the file

1. Resolve the argument to an absolute path.
2. Read the file with the Read tool.
3. If the file doesn't exist, fail with a clear message naming where you looked.
4. If the file does not have YAML frontmatter delimited by `---`, fail with `Not a valid portfolio-export.md — missing frontmatter.`

## Step 2 — Parse the frontmatter

Extract these fields. Required unless marked optional:

- `title` (required)
- `slug` (required) — must match `[a-z0-9-]+`
- `type` (required) — must be one of: `webApp`, `mobile`, `tool`, `experiment`
- `repositoryUrl` (required, may be empty string)
- `liveUrl` (optional)
- `coverImage` (optional)
- `shortDescription` (required)
- `technologies` (required) — array of objects `{ name, icon? }`
- `skills` (optional, default empty) — array of objects `{ name, evidence?, iconKey? }`

The markdown body that follows the frontmatter is **not** stored in `portfolio-data.ts`. It stays in the `.md` file under `content/projects/<slug>.md` and is loaded by `getProjectBody(slug)` at build time, then rendered on the project detail page via `react-markdown`. Your job is to make sure the `.md` file ends up at `content/projects/<slug>.md` (see Step 8) — that's where the rich body lives. Do not extract or transform the body.

If any required field is missing or malformed, stop and report what's wrong. Don't write partial state.

## Step 3 — Check for slug collision

Read `src/lib/portfolio-data.ts`. If a project with the same `slug` already exists:

- Output: `A project with slug "<slug>" already exists. Update it? (reply with "update" to overwrite, anything else aborts.)`
- Do not modify any file until the user confirms.

## Step 4 — Reconcile technologies (name-based, case-insensitive)

For each entry in the export's `technologies` array:

1. Look it up in the master `technologies` array in `portfolio-data.ts` by **case-insensitive match on `name`**.
2. If matched → record the existing `id` for use in the project entry.
3. If not matched → it's new:
   - Generate a stable id: lowercase, strip non-alphanum, fold spaces (e.g., `"Next.js"` → `nextjs`, `"PostgreSQL"` → `postgresql`, `"Cloud Run"` → `cloudrun`).
   - If that id already exists (collision with a different-cased name), append `-1`, `-2`, etc.
   - Append `{ id, name, icon? }` to the master `technologies` array, maintaining alphabetical order by `id`.
   - Track it under `addedTechnologies` for the summary.

## Step 5 — Reconcile skills (name-based, case-insensitive)

For each entry in the export's `skills` array:

1. Look it up in the master `skills` array by **case-insensitive match on `name`**.
2. If matched → record the existing `id`.
3. If not matched → it's new:
   - Generate a stable id: camelCase from the name (e.g., `"AI Integration"` → `aiIntegration`, `"Real-time Systems"` → `realTimeSystems`).
   - Pick an `iconKey` from this allowed set based on the skill's name:
     - `Bot` — AI/agents/LLM
     - `Cloud` — deployment/infra
     - `Code2` — APIs/development
     - `Database` — data/storage/schema
     - `GitBranch` — version control/git
     - `Layers3` — full-stack/architecture
     - `Wrench` — tooling/automation
     - `BriefcaseBusiness` — business logic / domain
     - `Sparkles` — fallback when nothing else fits
   - Append `{ id, name, iconKey }` to the master `skills` array (skills are intentionally unsorted — preserves curated order).
   - Track under `addedSkills` for the summary.

Skip the `evidence` field — that's for human validation in the .md only; it's not stored in `portfolio-data.ts`.

## Step 6 — Build the project entry

Construct the Project object using the **resolved ids** from Steps 4 and 5:

```ts
{
  id: "<slug>",
  slug: "<slug>",
  title: "<title>",
  type: "<type>",
  shortDescription: "<shortDescription>",
  technologies: [<resolved tech ids>],
  skills: [<resolved skill ids>],          // omit field if empty
  repositoryUrl: "<repositoryUrl>",        // omit field if empty
  liveUrl: "<liveUrl>",                    // omit field if empty
  coverImage: "<coverImage>",              // see Step 7
}
```

The long-form body content stays in the `.md` file — do not inline it here.

- If updating (user confirmed in Step 3): replace the existing entry in the `projects` array in place.
- If new: append to the end of the `projects` array.

Use the Edit tool. Match the existing formatting style (2-space indent, double-quoted strings).

## Step 7 — Handle the cover image

The frontmatter's `coverImage` value can be:

- **A public URL** (starts with `http://` or `https://`): fetch with
  `curl -sSL -o public/projects/<slug>.<ext> "<url>"`, infer extension from the URL path (default `.png`), then set `coverImage: "/projects/<slug>.<ext>"` in the data file.
- **A repo-relative path starting with `/projects/`** (already in this repo's public/): leave as-is.
- **Any other local path** (e.g., `./public/og.png`): the file is in the source repo, not here. Set `coverImage` to `"/projects/<slug>.png"` AND report at the end: `Cover image not auto-imported — please copy the file from the source repo to public/projects/<slug>.png manually.`
- **Empty or missing**: omit the `coverImage` field from the project entry.

## Step 8 — Move the export file into content/projects/

If the source `.md` file is not already at `content/projects/<slug>.md`:
- Move it there with `mv "<original-path>" "content/projects/<slug>.md"` (use `cp` instead if the original is outside the repo, e.g., under `~/Downloads`).

This keeps the import sources versioned alongside the data they produced.

## Step 9 — Do NOT touch the favorite

Never change `favoriteProjectSlug`. That's the user's decision. If they want the newly-imported project to become the favorite, they'll say so explicitly.

## Step 10 — Verify

Run `npm run lint` and report the result. Do not run `npm run build` automatically — lint is enough as a smoke test.

## Step 11 — Summary

Output a multi-line summary:

```
Imported: <title> (<slug>)
  Tech matched:   <names that resolved to existing ids, or "none">
  Tech added:     <names that were new and got registered, or "none">
  Skills matched: <names that resolved to existing ids, or "none">
  Skills added:   <names that were new and got registered, or "none">
  Cover image:    <path or "manual copy needed">
  Source file:    content/projects/<slug>.md
  Lint:           <pass or first error>
```

If any new tech or skill was registered, append a short note: `Review src/lib/portfolio-data.ts to confirm the auto-generated ids and (for skills) iconKey choices.`

Begin.
