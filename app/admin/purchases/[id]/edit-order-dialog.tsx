"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EditableItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

type ProductOption = {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string | null;
};

type CategoryOption = {
  id: string;
  name: string;
};

type Props = {
  purchase: {
    id: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    notes: string | null;
    items: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
    }[];
  };
};

export function EditOrderDialog({ purchase }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [shippingName, setShippingName] = useState(purchase.shippingName);
  const [shippingPhone, setShippingPhone] = useState(purchase.shippingPhone);
  const [shippingAddress, setShippingAddress] = useState(
    purchase.shippingAddress
  );
  const [shippingCity, setShippingCity] = useState(purchase.shippingCity);
  const [notes, setNotes] = useState(purchase.notes || "");
  const [items, setItems] = useState<EditableItem[]>(
    purchase.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
    }))
  );

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [productSelectKey, setProductSelectKey] = useState(0);

  // Reset form when dialog re-opens
  useEffect(() => {
    if (open) {
      setShippingName(purchase.shippingName);
      setShippingPhone(purchase.shippingPhone);
      setShippingAddress(purchase.shippingAddress);
      setShippingCity(purchase.shippingCity);
      setNotes(purchase.notes || "");
      setItems(
        purchase.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
        }))
      );
      setSelectedCategoryId("all");
    }
  }, [open, purchase]);

  // Pre-populate products and categories when dialog opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingCatalog(true);
    Promise.all([
      fetch("/api/admin/products?limit=50").then((r) => r.json()),
      fetch("/api/admin/categories?limit=50").then((r) => r.json()),
    ])
      .then(([productsData, categoriesData]) => {
        if (cancelled) return;
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load catalog");
      })
      .finally(() => {
        if (!cancelled) setLoadingCatalog(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filteredProducts =
    selectedCategoryId === "all"
      ? products
      : products.filter((p) => p.categoryId === selectedCategoryId);

  function addProductById(productId: string) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setProductSelectKey((k) => k + 1);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: p.id,
          productName: p.name,
          price: p.price,
          quantity: 1,
        },
      ];
    });
  }

  function updateItem(idx: number, patch: Partial<EditableItem>) {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function save() {
    if (items.length === 0) {
      toast.error("Order must have at least one item");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/purchases/${purchase.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName,
          shippingPhone,
          shippingAddress,
          shippingCity,
          notes: notes || null,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update order");
        return;
      }
      toast.success("Order updated");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
          Edit order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] w-[95vw] max-w-[95vw] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit order</DialogTitle>
          <DialogDescription>
            Update items, prices, and shipping details before sending the
            order to a courier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Items */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Items</h3>
            <div className="space-y-2">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No items yet — add a product below.
                </p>
              )}
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.productName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-muted-foreground">
                      ৳
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.price}
                      onChange={(e) =>
                        updateItem(idx, { price: Number(e.target.value) })
                      }
                      className="h-8 w-24"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Qty
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, {
                          quantity: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="h-8 w-16"
                    />
                  </div>
                  <p className="w-24 text-right text-sm font-semibold">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>
          </section>

          {/* Add product */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Add product</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={loadingCatalog}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Product
                </Label>
                <Select
                  key={productSelectKey}
                  onValueChange={addProductById}
                  disabled={loadingCatalog || filteredProducts.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingCatalog
                          ? "Loading..."
                          : filteredProducts.length === 0
                            ? "No products"
                            : "Select a product to add"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — ৳{p.price.toLocaleString()} (stock:{" "}
                        {p.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Shipping</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="ship-name">Recipient name</Label>
                <Input
                  id="ship-name"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ship-phone">Phone</Label>
                <Input
                  id="ship-phone"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="ship-address">Address</Label>
                <Input
                  id="ship-address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ship-city">City</Label>
                <Input
                  id="ship-city"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ship-notes">Notes</Label>
              <textarea
                id="ship-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save} loading={saving}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
