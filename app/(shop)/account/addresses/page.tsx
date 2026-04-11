"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Pencil, Trash2, X, MapPin } from "lucide-react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    isDefault: false,
  });

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  function resetForm() {
    setForm({ label: "Home", fullName: "", phone: "", address: "", city: "", isDefault: false });
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(a: Address) {
    setForm({ label: a.label, fullName: a.fullName, phone: a.phone, address: a.address, city: a.city, isDefault: a.isDefault });
    setEditId(a.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `/api/customer/addresses/${editId}` : "/api/customer/addresses";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editId ? "Address updated" : "Address added");
        resetForm();
        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/customer/addresses/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Address deleted"); fetchAddresses(); }
    } catch { toast.error("Failed to delete"); }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <Link href="/account" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> My Account
      </Link>

      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-display text-sm italic text-muted-foreground">Delivery info</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight">Saved <em className="font-display italic">addresses</em></h1>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-border/60 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-base tracking-tight">{editId ? "Edit address" : "New address"}</p>
            <button type="button" onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home" />
            </div>
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Address</Label>
              <Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch checked={form.isDefault} onCheckedChange={(v) => setForm({ ...form, isDefault: v })} />
              <Label>Default address</Label>
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editId ? "Update" : "Save"}</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-4 font-display text-xl italic text-muted-foreground">No saved addresses</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.label}</span>
                  {a.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Default</span>}
                </div>
                <p className="text-sm mt-0.5">{a.fullName} · {a.phone}</p>
                <p className="text-sm text-muted-foreground">{a.address}, {a.city}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(a)} className="rounded-md p-1.5 hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDelete(a.id)} className="rounded-md p-1.5 hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
