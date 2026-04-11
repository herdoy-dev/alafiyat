"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Log = {
  id: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetch_() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/activity?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
          setTotal(data.total);
        }
      } catch {
        toast.error("Failed to load activity log");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [page]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <p className="font-display text-sm italic text-muted-foreground">
          Admin actions
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Activity <em className="font-display italic">log</em>
        </h1>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString()} total events
        </p>
      </header>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No activity recorded yet
            </p>
          ) : (
            <>
              <div className="divide-y divide-border/50">
                {logs.map((log) => (
                  <div key={log.id} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{log.userName}</span>
                        <span className="text-muted-foreground"> — </span>
                        <span>{log.action}</span>
                        <span className="text-muted-foreground"> on </span>
                        <span className="font-mono text-xs">
                          {log.entity}
                          {log.entityId && ` #${log.entityId.slice(-8)}`}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {total > 30 && (
                <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(total / 30)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page * 30 >= total}
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
