"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { subscribeToPortfolioData } from "@/lib/firestore-data";
import { emptyPortfolioData } from "@/lib/empty-data";
import type { PortfolioData } from "@/lib/types";
import { NavPill } from "@/components/layout/NavPill/NavPill";
import { BackHomeLink } from "@/components/layout/BackHomeLink/BackHomeLink";

const BLOG_PAGE_SIZE = 4;

export function BlogPage() {
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => subscribeToPortfolioData(setData), []);

  const blogPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data.blogPosts;
    }

    return data.blogPosts.filter((post) =>
      [
        post.title,
        post.excerpt,
        post.content,
        post.publishedAt ?? "",
        ...post.tags,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.blogPosts, search]);
  const totalPages = Math.ceil(blogPosts.length / BLOG_PAGE_SIZE);
  const activePage = Math.min(page, Math.max(0, totalPages - 1));
  const visiblePosts = blogPosts.slice(
    activePage * BLOG_PAGE_SIZE,
    activePage * BLOG_PAGE_SIZE + BLOG_PAGE_SIZE,
  );
  const canPaginate = totalPages > 1;

  useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <main>
      <NavPill />
      <section className="section-pad bg-white">
        <div className="container">
          <BackHomeLink />
          <h1 className="text-[44px] font-bold leading-none tracking-[-1.2px] text-ink sm:text-[56px]">
            Blog <span className="font-normal text-muted">({data.blogPosts.length})</span>
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <label className="relative w-36 sm:w-40">
              <span className="sr-only">Search blog posts</span>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0075de]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-8 w-full rounded-full border border-[#0075de] bg-white pl-8 pr-3 text-xs font-semibold text-ink outline-none placeholder:text-muted"
              />
            </label>
            <button
              type="button"
              aria-label="Previous blog posts"
              disabled={!canPaginate}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0075de]"
              onClick={() => setPage((value) => (value - 1 + totalPages) % totalPages)}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="Next blog posts"
              disabled={!canPaginate}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0075de] text-[#0075de] transition hover:bg-[#0075de] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0075de]"
              onClick={() => setPage((value) => (value + 1) % totalPages)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {visiblePosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="whisper-card block p-5 transition hover:-translate-y-0.5 hover:border-[#0075de]/40 hover:shadow-[0_14px_36px_rgba(15,23,42,0.1)] focus-visible:ring-2 focus-visible:ring-[#0075de] focus-visible:ring-offset-2">
                <div className="text-sm font-semibold text-muted">{post.publishedAt}</div>
                <h2 className="mt-2 text-[22px] font-bold tracking-[-0.25px] text-ink">{post.title}</h2>
                <p className="mt-2 text-base leading-6 text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
          {!visiblePosts.length ? (
            <p className="mt-8 text-base font-semibold text-muted">No blog posts match this search.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
