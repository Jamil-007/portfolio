import Link from "next/link";
import { BriefcaseBusiness, Home, NotebookText } from "lucide-react";

export function NavPill() {
  const items = [
    { href: "/#top", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
    { href: "/blog", label: "Blog", icon: NotebookText },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-black/10 bg-white/20 p-1 shadow-[0_18px_45px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl md:bottom-auto md:left-auto md:right-5 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col"
    >
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          title={label}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#0075de] transition hover:bg-white/35 hover:text-[#005bab]"
        >
          <Icon size={19} strokeWidth={2.2} />
        </Link>
      ))}
    </nav>
  );
}
