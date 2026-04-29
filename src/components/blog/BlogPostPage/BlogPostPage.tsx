"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { subscribeToPortfolioData } from "@/lib/firestore-data";
import { emptyPortfolioData } from "@/lib/empty-data";
import type { PortfolioData } from "@/lib/types";
import { NavPill } from "@/components/layout/NavPill/NavPill";
import { BackHomeLink } from "@/components/layout/BackHomeLink/BackHomeLink";
import { NotFound } from "@/components/layout/NotFound/NotFound";

export function BlogPostPage({ slug }: { slug: string }) {
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);

  useEffect(() => subscribeToPortfolioData(setData), []);

  const post = data.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return <NotFound title="Blog post not found" />;
  }

  return (
    <main>
      <NavPill />
      <article className="section-pad bg-white">
        <div className="container max-w-3xl">
          <BackHomeLink />
          <div className="text-sm font-semibold text-muted">{post.publishedAt}</div>
          <h1 className="mt-4 text-[44px] font-bold leading-none tracking-[-1.2px] text-ink sm:text-[56px]">{post.title}</h1>
          <p className="mt-4 text-xl font-semibold leading-8 text-muted">{post.excerpt}</p>
          <div className="prose prose-neutral mt-8 max-w-none rounded-lg border border-black/10 bg-white p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>
    </main>
  );
}
