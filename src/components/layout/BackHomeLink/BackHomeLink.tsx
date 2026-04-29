import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackHomeLink() {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="mb-5 inline-flex h-10 w-10 items-center justify-center text-ink transition hover:text-[#0075de]"
    >
      <ArrowLeft size={18} />
    </Link>
  );
}
