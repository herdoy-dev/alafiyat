"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type SessionPage = { page: string; time: string };

type Session = {
  sessionId: string;
  pageCount: number;
  entryPage: string;
  exitPage: string;
  referrer: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  device: string | null;
  browser: string | null;
  city: string | null;
  startedAt: string | null;
  durationSeconds: number;
  pages: SessionPage[];
};

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatTime(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const DeviceIcon = ({ device }: { device: string | null }) => {
  const cls = "h-4 w-4 text-muted-foreground";
  if (device === "mobile") return <Smartphone className={cls} />;
  if (device === "tablet") return <Tablet className={cls} />;
  return <Monitor className={cls} />;
};

function SessionRow({ session }: { session: Session }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted/30 transition-colors"
      >
        <DeviceIcon device={session.device} />
        <div className="min-w-0 flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
          <div>
            <p className="font-medium truncate">{session.entryPage}</p>
            <p className="text-xs text-muted-foreground">
              {session.startedAt ? formatTime(session.startedAt) : "—"}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-muted-foreground">
              {session.pageCount} pages
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-muted-foreground">
              {formatDuration(session.durationSeconds)}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-muted-foreground truncate">
              {session.utmSource || session.referrer || "Direct"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">
              {session.city || "—"} · {session.browser || "—"}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="bg-muted/20 px-4 py-3 border-t border-border/30">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Journey
          </p>
          <div className="space-y-1.5">
            {session.pages.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </div>
                <span className="font-medium">{p.page}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(p.time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 30;

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/analytics/sessions?limit=${limit}&offset=${offset}`
        );
        if (res.ok) {
          const d = await res.json();
          setSessions(d.sessions);
          setTotal(d.total);
        }
      } catch {
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, [offset]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <Link
          href="/admin/analytics"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Analytics
        </Link>
        <p className="font-display text-sm italic text-muted-foreground">
          Visitor journeys
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Session <em className="font-display italic">recordings</em>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total.toLocaleString()} total sessions tracked
        </p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            <div className="hidden md:grid grid-cols-5 gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Entry Page</span>
              <span>Pages</span>
              <span>Duration</span>
              <span>Source</span>
              <span className="text-right">Location</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No sessions recorded yet
            </p>
          ) : (
            <>
              {sessions.map((s) => (
                <SessionRow key={s.sessionId} session={s} />
              ))}
              {total > limit && (
                <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {offset + 1}–{Math.min(offset + limit, total)} of{" "}
                    {total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setOffset(Math.max(0, offset - limit))
                      }
                      disabled={offset === 0}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setOffset(offset + limit)}
                      disabled={offset + limit >= total}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
