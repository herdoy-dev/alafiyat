"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";

type PageViewEntry = {
  id: string;
  sessionId: string;
  page: string;
  referrer?: string | null;
  device?: string | null;
  browser?: string | null;
  city?: string | null;
  utmSource?: string | null;
  createdAt: string;
};

const DeviceIcon = ({ device }: { device?: string | null }) => {
  const cls = "h-3.5 w-3.5 text-muted-foreground";
  if (device === "mobile") return <Smartphone className={cls} />;
  if (device === "tablet") return <Tablet className={cls} />;
  return <Monitor className={cls} />;
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function LiveFeed({ views }: { views: PageViewEntry[] }) {
  if (views.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No live activity
      </div>
    );
  }

  return (
    <div className="max-h-[400px] divide-y divide-border/50 overflow-y-auto">
      {views.map((v) => (
        <div
          key={v.id}
          className="flex items-center gap-3 px-1 py-2.5 text-sm"
        >
          <DeviceIcon device={v.device} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{v.page}</p>
            <p className="truncate text-xs text-muted-foreground">
              {v.city && `${v.city} · `}
              {v.browser && `${v.browser} · `}
              {v.utmSource && `via ${v.utmSource} · `}
              {v.referrer && `from ${v.referrer}`}
            </p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {timeAgo(v.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
