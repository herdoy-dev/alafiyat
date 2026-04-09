"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  LandingProductLite,
  LandingViewModel,
} from "@/components/landing/templates/types";
import type { LandingTemplate } from "@/schemas/landing";

export type DeviceMode = "mobile" | "tablet" | "desktop";

const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  mobile: 390,
  tablet: 820,
  desktop: 1280,
};

export function DeviceToggle({
  value,
  onChange,
}: {
  value: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}) {
  const items: Array<{
    id: DeviceMode;
    icon: React.ElementType;
    label: string;
  }> = [
    { id: "desktop", icon: Monitor, label: "Desktop" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "mobile", icon: Smartphone, label: "Mobile" },
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-card p-1 shadow-xs">
      {items.map((item) => {
        const Icon = item.icon;
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={item.label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

type Props = {
  device: DeviceMode;
  template: LandingTemplate;
  landing: LandingViewModel;
  product: LandingProductLite | null;
};

export function LandingPreview({ device, template, landing, product }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const deviceWidth = DEVICE_WIDTHS[device];

  // Listen for the iframe's "ready" handshake
  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.data?.type === "landing-preview-ready") {
        setReady(true);
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Push state into the iframe whenever inputs change (and on first ready)
  useEffect(() => {
    if (!ready) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      {
        type: "landing-preview-update",
        state: { landing, product, template },
      },
      window.location.origin
    );
  }, [ready, landing, product, template]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#f3f3f5] dark:bg-[#0c0d10]">
      {/* Centered, scrollable preview area */}
      <div className="flex flex-1 items-stretch justify-center overflow-auto p-3 md:p-5">
        {/* Device frame */}
        <div
          className="my-1 flex h-full max-h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl"
          style={{
            width: deviceWidth,
            maxWidth: "100%",
          }}
        >
          {/* Browser-chrome bar */}
          <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border/60 bg-muted/50 px-3">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
            <span className="ml-3 truncate font-mono text-[10px] text-muted-foreground">
              /l/{landing.slug || "preview"}
            </span>
          </div>

          {/* Iframe — its viewport width = deviceWidth, so Tailwind responsive
              classes inside the templates fire correctly at the device width */}
          <iframe
            ref={iframeRef}
            src="/landing-editor-preview"
            title="Landing preview"
            className="block h-full w-full flex-1 border-0 bg-background"
          />
        </div>
      </div>
    </div>
  );
}
