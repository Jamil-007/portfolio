export function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-ink">
      {label}
      <select {...props} className="rounded border border-black/10 bg-white px-3 py-2 font-normal text-ink">
        {children}
      </select>
    </label>
  );
}
