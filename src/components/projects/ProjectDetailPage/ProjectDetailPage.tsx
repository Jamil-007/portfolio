"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { subscribeToPortfolioData } from "@/lib/firestore-data";
import { emptyPortfolioData } from "@/lib/empty-data";
import type { PortfolioData } from "@/lib/types";
import { settingsOptionLabel } from "@/lib/portfolio-utils";
import { Badge } from "@/components/shared/Badge/Badge";
import { NavPill } from "@/components/layout/NavPill/NavPill";
import { BackHomeLink } from "@/components/layout/BackHomeLink/BackHomeLink";
import { NotFound } from "@/components/layout/NotFound/NotFound";
import { InfoBlock } from "@/components/projects/InfoBlock/InfoBlock";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);

  useEffect(() => subscribeToPortfolioData(setData), []);

  const project = data.projects.find((item) => item.slug === slug);

  if (!project) {
    return <NotFound title="Project not found" />;
  }

  return (
    <main>
      <NavPill />
      <article className="section-pad bg-white">
        <div className="container max-w-4xl">
          <BackHomeLink />
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">{settingsOptionLabel(data.settings.projectTypes, project.type)}</Badge>
          </div>
          <h1 className="mt-5 text-[44px] font-bold leading-none tracking-[-1.2px] text-ink sm:text-[56px]">{project.title}</h1>
          <p className="mt-4 text-xl font-semibold leading-8 text-muted">{project.shortDescription}</p>
          <div className="prose prose-neutral mt-8 max-w-none rounded-lg border border-black/10 bg-white p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.longDescription}</ReactMarkdown>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock title="Technologies" items={project.technologies} />
          </div>
        </div>
      </article>
    </main>
  );
}
