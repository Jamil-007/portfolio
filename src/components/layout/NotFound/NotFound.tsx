import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";

export function NotFound({ title }: { title: string }) {
  return (
    <main className="bg-cream text-ink min-h-screen">
      <SiteHeader />
      <section className="pt-40 pb-24">
        <div className="container">
          <div className="mono-label text-quiet">404</div>
          <h1 className="serif-display mt-3 text-[clamp(2.5rem,9vw,6rem)]">{title}</h1>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[rgba(23,23,23,0.2)] px-4 py-2 text-sm font-medium text-ink transition hover:border-ink"
          >
            <ArrowLeft size={14} /> Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
