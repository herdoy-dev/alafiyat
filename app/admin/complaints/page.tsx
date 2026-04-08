"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CheckCircle2, Mail, Phone, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataPagination,
  DEFAULT_PAGE_SIZE,
} from "@/components/admin/data-pagination";

type Complaint = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string;
  status: "open" | "resolved";
  createdAt: string;
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/admin/complaints?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints);
        setTotal(data.total);
      }
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [filter, page, limit]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  async function handleResolve(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (res.ok) {
        toast.success("Marked resolved");
        fetchComplaints();
      } else {
        toast.error("Failed to update");
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this complaint?")) return;
    const res = await fetch(`/api/admin/complaints/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Complaint deleted");
      fetchComplaints();
    } else {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">
            Customer complaints submitted via the contact form
          </p>
        </div>
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v as "all" | "open" | "resolved");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No complaints {filter !== "all" ? `(${filter})` : ""} yet.
          </CardContent>
        </Card>
      ) : (
        <>
        <div className="space-y-4">
          {complaints.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {c.fullName}
                      <Badge
                        variant={
                          c.status === "resolved" ? "success" : "secondary"
                        }
                      >
                        {c.status}
                      </Badge>
                    </CardTitle>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {c.email}
                      </span>
                      <span>
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {c.status === "open" && (
                      <Button
                        size="sm"
                        variant="success"
                        disabled={updatingId === c.id}
                        onClick={() => handleResolve(c.id)}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm">{c.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <DataPagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
        </>
      )}
    </div>
  );
}
