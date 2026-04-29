export function AdminGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">{children}</div>;
}
