"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("0");
  const [maxUses, setMaxUses] = useState("");
  const [active, setActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  function resetForm() {
    setCode("");
    setType("percentage");
    setValue("");
    setMinOrder("0");
    setMaxUses("");
    setActive(true);
    setExpiresAt("");
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(c: Coupon) {
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setMinOrder(String(c.minOrder));
    setMaxUses(c.maxUses !== null ? String(c.maxUses) : "");
    setActive(c.active);
    setExpiresAt(c.expiresAt ? c.expiresAt.slice(0, 10) : "");
    setEditId(c.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      code,
      type,
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      maxUses: maxUses ? Number(maxUses) : null,
      active,
      expiresAt: expiresAt || null,
    };

    try {
      const url = editId
        ? `/api/admin/coupons/${editId}`
        : "/api/admin/coupons";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editId ? "Coupon updated" : "Coupon created");
        resetForm();
        fetchCoupons();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save coupon");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Coupon deleted");
        fetchCoupons();
      }
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res.ok) fetchCoupons();
    } catch {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <p className="font-display text-sm italic text-muted-foreground">
          Promotions
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            Coupon <em className="font-display italic">codes</em>
          </h1>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Coupon
          </Button>
        </div>
      </header>

      {/* Create/Edit form */}
      {showForm && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold">
              {editId ? "Edit Coupon" : "New Coupon"}
            </CardTitle>
            <button onClick={resetForm}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="WELCOME10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">
                  Value {type === "percentage" ? "(%)" : "(৳)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="10"
                  required
                  min={1}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minOrder">Min Order (৳)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxUses">Max Uses (empty = unlimited)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                  min={1}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={active}
                    onCheckedChange={setActive}
                    id="active"
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={saving} className="w-full">
                  <Check className="mr-1 h-4 w-4" />
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No coupons yet. Create your first one!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Discount</th>
                    <th className="px-4 py-3 text-left">Min Order</th>
                    <th className="px-4 py-3 text-left">Usage</th>
                    <th className="px-4 py-3 text-left">Expires</th>
                    <th className="px-4 py-3 text-center">Active</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono font-semibold">
                        {c.code}
                      </td>
                      <td className="px-4 py-3">
                        {c.type === "percentage"
                          ? `${c.value}%`
                          : `৳${c.value.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3">
                        ৳{c.minOrder.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {c.usedCount}
                        {c.maxUses !== null ? ` / ${c.maxUses}` : " / ∞"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.expiresAt
                          ? new Date(c.expiresAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={c.active}
                          onCheckedChange={() =>
                            toggleActive(c.id, c.active)
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => startEdit(c)}
                            className="rounded-md p-1.5 hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="rounded-md p-1.5 hover:bg-destructive/10 text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
