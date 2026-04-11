"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Users, Activity, Clock } from "lucide-react";
import { TrafficSourcesChart } from "@/components/admin/charts/traffic-sources-chart";
import { TopPagesChart } from "@/components/admin/charts/top-pages-chart";
import { DeviceBreakdownChart } from "@/components/admin/charts/device-breakdown-chart";
import { VisitorTimelineChart } from "@/components/admin/charts/visitor-timeline-chart";
import { LiveFeed } from "@/components/admin/charts/live-feed";

type LiveView = {
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

type AnalyticsData = {
  activeVisitors: number;
  totalViewsToday: number;
  totalViews7d: number;
  recentViews: LiveView[];
  trafficSources: { source: string; count: number }[];
  utmBreakdown: { source: string; campaign: string | null; count: number }[];
  topPages: { page: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  cityBreakdown: { city: string; count: number }[];
  hourlyTimeline: { hour: string; views: number }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveViews, setLiveViews] = useState<LiveView[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const lastPoll = useRef<string>(new Date().toISOString());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const d = await res.json();
          setData(d);
          setLiveViews(d.recentViews);
          setActiveCount(d.activeVisitors);
        }
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pollLive = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/analytics/live?since=${encodeURIComponent(lastPoll.current)}`
      );
      if (res.ok) {
        const d = await res.json();
        if (d.views.length > 0) {
          setLiveViews((prev) => {
            const merged = [...d.views, ...prev];
            const seen = new Set<string>();
            return merged.filter((v: LiveView) => {
              if (seen.has(v.id)) return false;
              seen.add(v.id);
              return true;
            }).slice(0, 50);
          });
        }
        setActiveCount(d.activeVisitors);
        lastPoll.current = d.timestamp;
      }
    } catch {}
  }, []);

  useEffect(() => {
    const interval = setInterval(pollLive, 3000);
    return () => clearInterval(interval);
  }, [pollLive]);

  const statCards = [
    {
      title: "Live Visitors",
      value: activeCount,
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800/50",
      pulse: true,
    },
    {
      title: "Views Today",
      value: data?.totalViewsToday ?? 0,
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800/50",
    },
    {
      title: "Views (7 days)",
      value: data?.totalViews7d ?? 0,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800/50",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <p className="font-display text-sm italic text-muted-foreground">
          Real-time insights
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            Live <em className="font-display italic">analytics</em>
          </h1>
          <Link
            href="/admin/analytics/sessions"
            className="rounded-lg border border-border/70 bg-card px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <Clock className="mr-2 inline-block h-4 w-4" />
            Session Recordings
          </Link>
        </div>
      </header>

      {/* Live stat cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border ${card.border} ${card.bg} p-5`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs font-medium uppercase tracking-wider ${card.color}`}>
                {card.title}
              </p>
              <div className="flex items-center gap-1.5">
                {card.pulse && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                )}
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            {loading ? (
              <Skeleton className="mt-2 h-9 w-20" />
            ) : (
              <p className="mt-2 font-display text-3xl leading-none tracking-tight tabular-nums">
                {card.value.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Live feed + Timeline */}
      <section className="space-y-3">
        <SectionLabel>Live activity</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">
                Visitor timeline · last 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <VisitorTimelineChart data={data.hourlyTimeline} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">
                Live feed
              </CardTitle>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <LiveFeed views={liveViews} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Traffic sources + Top pages */}
      <section className="space-y-3">
        <SectionLabel>Traffic & content</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Traffic sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <TrafficSourcesChart data={data.trafficSources} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Top pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <TopPagesChart data={data.topPages} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Device + Browser */}
      <section className="space-y-3">
        <SectionLabel>Devices & browsers</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Device breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <DeviceBreakdownChart data={data.deviceBreakdown} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Browser breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <DeviceBreakdownChart
                  data={data.browserBreakdown.map((b) => ({
                    device: b.browser,
                    count: b.count,
                  }))}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* UTM + City breakdown tables */}
      <section className="space-y-3">
        <SectionLabel>Campaigns & locations</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                UTM campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[200px] w-full" />
              ) : data.utmBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No UTM data yet
                </p>
              ) : (
                <div className="divide-y divide-border/50 text-sm">
                  <div className="grid grid-cols-3 gap-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span>Source</span>
                    <span>Campaign</span>
                    <span className="text-right">Views</span>
                  </div>
                  {data.utmBreakdown.map((u, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 py-2">
                      <span className="font-medium">{u.source}</span>
                      <span className="text-muted-foreground truncate">
                        {u.campaign || "—"}
                      </span>
                      <span className="text-right tabular-nums">
                        {u.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Top cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <Skeleton className="h-[200px] w-full" />
              ) : data.cityBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No city data yet
                </p>
              ) : (
                <div className="divide-y divide-border/50 text-sm">
                  <div className="grid grid-cols-2 gap-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span>City</span>
                    <span className="text-right">Views</span>
                  </div>
                  {data.cityBreakdown.map((c) => (
                    <div key={c.city} className="grid grid-cols-2 gap-2 py-2">
                      <span className="font-medium">{c.city}</span>
                      <span className="text-right tabular-nums">
                        {c.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-xs italic uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}
