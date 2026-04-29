export function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-ink">
      {label}
      <textarea {...props} className="rounded border border-black/10 bg-white px-3 py-2 font-normal leading-6 text-ink" />
    </label>
  );
}
