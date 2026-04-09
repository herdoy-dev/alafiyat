"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const GREETING: Message = {
  id: "greet",
  role: "assistant",
  content:
    "👋 Hi! I'm the Al Amirat shopping assistant. Ask me about our products, prices, payment options, or anything else.",
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { id: uid(), role: "user", content: text };
    const placeholder: Message = { id: uid(), role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMessage, placeholder]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMessage]
        .filter((m) => m.id !== "greet")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id ? { ...m, content: acc } : m
          )
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholder.id
            ? { ...m, content: `⚠️ ${errorMsg}` }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    if (loading) return;
    setMessages([GREETING]);
    setInput("");
  }

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (open && window.matchMedia("(max-width: 767px)").matches) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      {/* Floating button — hidden on mobile when chat is open (close lives in header) */}
      <Button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-16 w-16 rounded-full text-white shadow-lg [&_svg]:!size-7",
          open && "max-md:hidden"
        )}
        size="icon"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X /> : <MessageCircle />}
      </Button>

      {/* Chat panel — fullscreen on mobile, floating on desktop */}
      <div
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-2xl transition-all duration-200",
          // Mobile: full viewport
          "inset-0 rounded-none border-0",
          // Desktop: floating panel
          "md:inset-auto md:bottom-24 md:right-5 md:h-[min(620px,calc(100vh-9rem))] md:w-[calc(100vw-2.5rem)] md:max-w-sm md:rounded-2xl md:border md:origin-bottom-right",
          open
            ? "opacity-100 md:scale-100"
            : "pointer-events-none opacity-0 md:scale-95"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-primary px-4 py-3 text-primary-foreground md:rounded-t-2xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-sm">
            <Image
              src="/logo.png"
              alt="Al Amirat"
              width={40}
              height={40}
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold leading-tight">
              Al Amirat Assistant
            </p>
            <p className="text-xs leading-tight opacity-80">
              Ask about our products
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            onClick={clearChat}
            disabled={loading || messages.length <= 1}
            title="Clear chat"
            aria-label="Clear chat"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {m.content || (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking…
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              rows={1}
              className="max-h-28 min-h-9 flex-1 resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="button"
              size="icon"
              className="h-9 w-9 shrink-0"
              disabled={loading || input.trim() === ""}
              onClick={send}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
