"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";

export default function BannerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [bgColor, setBgColor] = useState("#1a1a2e");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          const b = data.banner || {};
          setEnabled(b.banner_enabled === "true");
          setText(b.banner_text || "");
          setLink(b.banner_link || "");
          setBgColor(b.banner_bg_color || "#1a1a2e");
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banner: {
            banner_enabled: enabled ? "true" : "false",
            banner_text: text,
            banner_link: link,
            banner_bg_color: bgColor,
          },
        }),
      });
      if (res.ok) {
        toast.success("Banner settings saved");
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Announcement Bar
          </CardTitle>
          <CardDescription>
            Display a banner at the top of your store to promote sales, announcements,
            or important information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              id="banner-enabled"
            />
            <Label htmlFor="banner-enabled" className="font-medium">
              {enabled ? "Enabled" : "Disabled"}
            </Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="banner-text">Banner Text</Label>
            <Input
              id="banner-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Free shipping on orders over ৳2,000!"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="banner-link">Link (optional)</Label>
            <Input
              id="banner-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products"
            />
            <p className="text-xs text-muted-foreground">
              Clicking the banner will navigate to this URL
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="banner-color">Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border"
              />
              <Input
                id="banner-color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                placeholder="#1a1a2e"
                className="max-w-[160px]"
              />
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div className="space-y-1.5">
              <Label>Preview</Label>
              <div
                className="rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
                style={{ backgroundColor: bgColor }}
              >
                {text}
              </div>
            </div>
          )}

          <Button onClick={save} disabled={saving} className="mt-2">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Banner Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
