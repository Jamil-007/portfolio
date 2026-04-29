export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section className="section-pad bg-paper">
        <div className="container">{children}</div>
      </section>
    </main>
  );
}
