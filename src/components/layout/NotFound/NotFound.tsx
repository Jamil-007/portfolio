import Link from "next/link";
import { NavPill } from "@/components/layout/NavPill/NavPill";

export function NotFound({ title }: { title: string }) {
  return (
    <main>
      <NavPill />
      <section className="section-pad bg-white">
        <div className="container">
          <h1 className="text-4xl font-bold text-ink">{title}</h1>
          <Link href="/" className="mt-4 inline-flex text-[#0075de] hover:underline">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
