"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, Link2, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File must be under 4MB");
      return;
    }

    setUploading(true);
    try {
      // Use UploadThing's API directly
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/uploadthing", {
        method: "POST",
        headers: {
          "x-uploadthing-package": "@uploadthing/react",
          "x-uploadthing-fe-package": "@uploadthing/react",
        },
        body: JSON.stringify({
          files: [{ name: file.name, size: file.size, type: file.type }],
          routeConfig: { image: { maxFileSize: "4MB", maxFileCount: 1 } },
          input: {},
          callbackSlug: "productImage",
        }),
      });

      if (!res.ok) {
        // Fallback: if UploadThing doesn't work, switch to URL mode
        toast.error("Upload not configured. Use URL instead.");
        setMode("url");
        return;
      }

      const data = await res.json();
      if (data?.[0]?.url) {
        onChange(data[0].url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed. Use URL instead.");
        setMode("url");
      }
    } catch {
      toast.error("Upload failed. Use URL instead.");
      setMode("url");
    } finally {
      setUploading(false);
    }
  }

  function handleUrlSubmit() {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium">{label}</p>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Upload className="mr-1 inline h-3 w-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Link2 className="mr-1 inline h-3 w-3" />
          URL
        </button>
      </div>

      {mode === "upload" ? (
        <div className="relative">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/70 bg-muted/30 p-6 transition-colors hover:border-primary/40 hover:bg-muted/50">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Click to upload (max 4MB)"}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              onChange(e.target.value);
            }}
            onBlur={handleUrlSubmit}
          />
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <div className="relative aspect-square w-20 overflow-hidden rounded-lg border bg-muted">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
