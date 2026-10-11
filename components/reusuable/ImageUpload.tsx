"use client";

import { supabase } from "@/libs/supabase";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  pathPrefix: string;
  bucket?: string;
  hint?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({
  label,
  value,
  onChange,
  pathPrefix,
  bucket = "menu-images",
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreview(null);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    clearPreview();

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreview(objectUrl);
    setUploading(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const path = `${pathPrefix}/${Date.now()}-${safeName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError) {
        clearPreview();
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      onChange(data.publicUrl);
    } catch {
      clearPreview();
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    clearPreview();
    setError(null);
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const displayImage = preview ?? (value || null);

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-[#351B46]">
        {label}
      </label>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {/* Image preview */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#EADFF0] bg-[#F7F0FA]">
          {displayImage ? (
            <img
              src={displayImage}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-[#763C92]/50" />
          )}
        </div>

        {/* Upload controls */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-full bg-[#763C92] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#763C92]/20 transition-colors hover:bg-[#5D2D75] focus:outline-none focus:ring-4 focus:ring-[#763C92]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : value || preview
                  ? "Change photo"
                  : "Upload photo"}
            </button>

            {(value || preview) && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>

          {hint && (
            <p className="mt-2 text-xs leading-5 text-gray-500">{hint}</p>
          )}

          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG, or WebP. Maximum size: 5 MB.
          </p>
        </div>
      </div>

      {uploading && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F7F0FA]">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#763C92]" />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
