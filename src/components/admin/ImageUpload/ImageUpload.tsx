"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { getFirebaseServices } from "@/lib/firebase";

export function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    try {
      const services = getFirebaseServices();
      const idToken = (await services?.auth.currentUser?.getIdToken()) ?? "";
      if (!idToken) throw new Error("Not signed in.");

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: idToken,
      });
      onChange(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-1 text-sm font-semibold text-ink">
      <span>{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />
      {value ? (
        <div className="flex items-center gap-3 rounded border border-black/10 bg-white p-2">
          <div className="relative h-16 w-24 overflow-hidden rounded bg-black/[0.04]">
            <Image src={value} alt="" fill sizes="96px" className="object-cover" unoptimized />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-normal text-muted">{value}</div>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1 rounded border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-60"
              >
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="inline-flex items-center gap-1 rounded border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-60"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded border border-dashed border-black/15 bg-white px-3 py-6 font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {uploading ? "Uploading…" : "Choose image"}
        </button>
      )}
      {error ? <span className="text-xs font-normal text-red-600">{error}</span> : null}
    </div>
  );
}
