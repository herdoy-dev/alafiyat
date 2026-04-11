"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function AnnouncementBar({
  text,
  link,
  bgColor,
}: {
  text: string;
  link?: string;
  bgColor?: string;
}) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem("banner_dismissed") === "true");
  }, []);

  if (dismissed || !text) return null;

  const handleDismiss = () => {
    localStorage.setItem("banner_dismissed", "true");
    setDismissed(true);
  };

  const content = (
    <div
      className="relative flex items-center justify-center px-10 py-2 text-center text-sm font-medium text-white"
      style={{ backgroundColor: bgColor || "#1a1a2e" }}
    >
      <span>{text}</span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
