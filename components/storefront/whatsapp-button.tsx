"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ phoneNumber }: { phoneNumber: string }) {
  const message = encodeURIComponent(
    "Hi! I'm interested in your products on Al Amirat."
  );
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
}
