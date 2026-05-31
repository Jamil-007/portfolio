// Server-only: reads the markdown body for a project from
// `content/projects/<slug>.md` at build time.
//
// We keep the rich project description as a real Markdown file (not
// inlined into portfolio-data.ts) because it can run to dozens of lines
// — code blocks, tables, headings — and is much easier to edit as .md.
// portfolio-data.ts stays focused on identity + metadata.

import fs from "node:fs";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "content", "projects");

// Sections that are useful inside the .md file for review/audit but should
// NOT appear on the public project detail page. They contain source-repo
// paths and export metadata.
const INTERNAL_SECTIONS = ["Screenshots", "File index"];

export function getProjectBody(slug: string): string {
  const filePath = path.join(CONTENT_ROOT, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return stripInternalSections(stripFrontmatter(raw)).trim();
}

function stripInternalSections(body: string): string {
  // Split the body at every `## ` heading (keep each heading with its chunk).
  const chunks = body.split(/(?=^##\s)/m);
  const internal = new Set(INTERNAL_SECTIONS.map((name) => name.toLowerCase()));
  return chunks
    .filter((chunk) => {
      const match = chunk.match(/^##\s+(.+?)\s*$/m);
      if (!match) return true; // intro text (before the first heading) — keep
      return !internal.has(match[1].toLowerCase());
    })
    .join("");
}

function stripFrontmatter(raw: string): string {
  // If the file starts with `---`, drop the YAML block.
  if (!raw.startsWith("---")) {
    return raw;
  }
  const closing = raw.indexOf("\n---", 3);
  if (closing === -1) {
    return raw;
  }
  return raw.slice(closing + 4);
}
