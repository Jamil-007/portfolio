"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, Github, Sparkles } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { projectTypeLabel } from "@/lib/portfolio-utils";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { NotFound } from "@/components/layout/NotFound/NotFound";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon/TechnologyIcon";
import { SkillPill, skillIconMap } from "@/components/shared/SkillPill/SkillPill";

// Custom renderers for the project body markdown. Drives all visual hierarchy
// for the rich content (headings, prose, lists, tables, code blocks) since we
// don't ship @tailwindcss/typography.
const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="serif-display mt-14 text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="serif-display mt-10 text-[clamp(1.25rem,2.5vw,1.5rem)] text-ink">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-[16px] leading-8 text-muted">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 space-y-2 pl-5 text-[15px] leading-7 text-muted [&>li]:list-disc [&>li]:marker:text-quiet">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 space-y-2 pl-5 text-[15px] leading-7 text-muted [&>li]:list-decimal [&>li]:marker:text-quiet">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
  em: ({ children }) => <em className="serif-italic text-ink">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      className="text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    // Block code (has a `language-xxx` class via fenced ``` blocks)
    if (className) {
      return <code className={className}>{children}</code>;
    }
    // Inline code
    return (
      <code className="rounded-md bg-[rgba(23,23,23,0.06)] px-1.5 py-0.5 font-mono text-[0.875em] text-ink">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-lg border border-[rgba(23,23,23,0.12)] bg-paper p-4 font-mono text-[12.5px] leading-6 text-ink">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-lg border border-[rgba(23,23,23,0.12)]">
      <table className="w-full border-collapse text-left text-[14px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-paper text-ink">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border-b border-[rgba(23,23,23,0.12)] px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[rgba(23,23,23,0.06)] px-4 py-2.5 align-top text-muted last:border-b-0">
      {children}
    </td>
  ),
  hr: () => <hr className="my-12 border-t border-[rgba(23,23,23,0.12)]" />,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-accent/40 pl-4 italic text-muted">
      {children}
    </blockquote>
  ),
};

export function ProjectDetailPage({ slug, body }: { slug: string; body: string }) {
  const data = portfolioData;
  const project = data.projects.find((item) => item.slug === slug);

  if (!project) {
    return <NotFound title="Project not found" />;
  }

  const typeLabel = projectTypeLabel(data.projectTypes, project.type);
  const techEntries = project.technologies
    .map((id) => data.technologies.find((tech) => tech.id === id))
    .filter((tech): tech is NonNullable<typeof tech> => Boolean(tech));
  const skillEntries = (project.skills ?? [])
    .map((id) => data.skills.find((skill) => skill.id === id))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));

  return (
    <main className="bg-cream text-ink min-h-screen">
      <SiteHeader
        email={data.profile.email}
        currentPath="/projects"
        photoUrl={data.profile.photoUrl}
        name={data.profile.name}
      />
      <article className="pt-28 pb-24 sm:pt-36">
        <div className="container max-w-4xl">
          <Link
            href="/projects"
            className="mono-label inline-flex items-center gap-2 text-muted transition hover:text-ink"
          >
            <ArrowLeft size={14} /> Back to projects
          </Link>

          <div className="mono-label mt-10 text-quiet">{typeLabel}</div>
          <h1 className="serif-display mt-3 text-[clamp(2.5rem,8vw,5.5rem)]">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-8 text-muted">{project.shortDescription}</p>

          {project.liveUrl || project.repositoryUrl ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:bg-accent"
                >
                  <ExternalLink size={14} /> Live site
                </a>
              ) : null}
              {project.repositoryUrl ? (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] px-4 py-2 text-sm font-medium text-ink transition hover:border-ink"
                >
                  <Github size={14} /> Repository
                </a>
              ) : null}
            </div>
          ) : null}

          {project.coverImage ? (
            <div className="mt-12 overflow-hidden rounded-lg bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={`${project.title} cover`}
                className="w-full"
              />
            </div>
          ) : null}

          {techEntries.length ? (
            <div className="mt-10">
              <div className="mono-label text-quiet">Built with</div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {techEntries.map((tech) => (
                  <TechnologyIcon
                    key={tech.id}
                    name={tech.name}
                    icon={tech.icon}
                    onClick={() => undefined}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {skillEntries.length ? (
            <div className="mt-8">
              <div className="mono-label text-quiet">Skills demonstrated</div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {skillEntries.map((skill) => (
                  <SkillPill
                    key={skill.id}
                    name={skill.name}
                    icon={skillIconMap[skill.iconKey as keyof typeof skillIconMap] ?? Sparkles}
                    onClick={() => undefined}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {body ? (
            <div className="mt-16 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {body}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
