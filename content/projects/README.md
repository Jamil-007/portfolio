# Project exports

This directory holds the `portfolio-export.md` files produced by running
`/portfolio-export` inside each source-project repo.

## Conventions

- One file per project, named `<slug>.md` (must match the project's `slug`
  field in the frontmatter).
- These files are the source-of-truth descriptions used to populate entries
  in `src/lib/portfolio-data.ts`.
- After updating a file here, run `/import-project content/projects/<slug>.md`
  (or just `/import-project <slug>`) to apply the changes to the live data.

## Workflow

1. In the source repo, run `/portfolio-export`. It writes
   `portfolio-export.md` at that repo's root.
2. Move (or copy + rename) that file to `content/projects/<slug>.md` here.
3. If the file references a local `coverImage`, also copy that image to
   `public/projects/<slug>.<ext>` and update the `coverImage` field to
   `/projects/<slug>.<ext>`.
4. Run `/import-project <slug>` to write the entry into `portfolio-data.ts`.
5. `npm run lint && npm run build` to verify.

## Why keep these files in the repo

- Re-importable if the data file gets corrupted or refactored.
- Auditable — every project entry can be traced back to a written
  description of the codebase.
- Diffs over time tell you what changed about each project.
