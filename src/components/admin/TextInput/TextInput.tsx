export function TextInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-ink">
      {label}
      <input {...props} className="rounded border border-black/10 bg-white px-3 py-2 font-normal text-ink" />
    </label>
  );
}
