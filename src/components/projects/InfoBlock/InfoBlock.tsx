import { Badge } from "@/components/shared/Badge/Badge";

export function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5">
      <h2 className="font-bold text-ink">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} tone="neutral">
            {item}
          </Badge>
        ))}
      </div>
    </section>
  );
}
