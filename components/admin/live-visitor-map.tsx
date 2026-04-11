"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type VisitorLocation = {
  id: string;
  sessionId: string;
  page: string;
  city: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type LeafletMap = any;
type LeafletMarker = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function LiveVisitorMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markers = useRef<LeafletMarker[]>([]);
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics/locations");
      if (res.ok) {
        const data = await res.json();
        setLocations(data.locations || []);
      }
    } catch {}
  }, []);

  // Initial load + polling
  useEffect(() => {
    fetchLocations().finally(() => setLoading(false));
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, [fetchLocations]);

  // Initialize Leaflet map
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!mapRef.current) return;

      // Dynamic import so Leaflet only loads on the client
      const L = await import("leaflet");

      // Inject Leaflet CSS once
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.integrity =
          "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        link.crossOrigin = "";
        document.head.appendChild(link);
      }

      if (cancelled || !mapRef.current) return;

      // Prevent re-initializing
      if (mapInstance.current) return;

      mapInstance.current = L.map(mapRef.current, {
        center: [23.8103, 90.4125], // Dhaka
        zoom: 6,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapInstance.current);

      setMapReady(true);
    }

    init().catch(() => {});

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;

    let cancelled = false;

    async function updateMarkers() {
      const L = await import("leaflet");
      if (cancelled || !mapInstance.current) return;

      // Clear old markers
      markers.current.forEach((m) => mapInstance.current.removeLayer(m));
      markers.current = [];

      // Custom green pulsing icon
      const icon = L.divIcon({
        className: "custom-visitor-marker",
        html: `
          <div style="position:relative;width:16px;height:16px">
            <div style="position:absolute;inset:0;border-radius:50%;background:#22c55e;opacity:0.4;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></div>
            <div style="position:absolute;inset:3px;border-radius:50%;background:#16a34a;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.3)"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      for (const loc of locations) {
        try {
          const marker = L.marker([loc.latitude, loc.longitude], { icon })
            .addTo(mapInstance.current)
            .bindPopup(
              `
              <div style="font-family:system-ui;min-width:180px">
                <div style="font-weight:600;font-size:13px;margin-bottom:4px">
                  📍 ${loc.city || "Unknown"}${loc.country ? `, ${loc.country}` : ""}
                </div>
                <div style="font-size:12px;color:#666;margin-bottom:2px">
                  ${loc.page}
                </div>
                <div style="font-size:11px;color:#999">
                  ${loc.device || ""} ${loc.browser ? `· ${loc.browser}` : ""}
                </div>
                <div style="font-size:11px;color:#999;margin-top:4px">
                  ${timeAgo(loc.createdAt)}
                </div>
              </div>
            `
            );
          markers.current.push(marker);
        } catch {}
      }
    }

    updateMarkers();

    return () => {
      cancelled = true;
    };
  }, [locations, mapReady]);

  return (
    <div className="relative">
      <style jsx global>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .leaflet-container {
          background: #f3f4f6;
        }
        .dark .leaflet-container {
          background: #1f2937;
        }
      `}</style>
      {loading && !mapReady && (
        <div className="absolute inset-0 z-10 rounded-xl">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
      <div
        ref={mapRef}
        className="h-[400px] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30"
      />
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>
            {locations.length}{" "}
            {locations.length === 1 ? "visitor" : "visitors"} active (last 15 min)
          </span>
        </div>
        <span>Updates every 10s</span>
      </div>
    </div>
  );
}
