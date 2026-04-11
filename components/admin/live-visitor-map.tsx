"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

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

declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => GoogleMap;
        marker: {
          AdvancedMarkerElement: new (opts: Record<string, unknown>) => GoogleMarker;
          PinElement: new (opts: Record<string, unknown>) => { element: HTMLElement };
        };
        InfoWindow: new (opts: Record<string, unknown>) => GoogleInfoWindow;
        importLibrary: (lib: string) => Promise<unknown>;
      };
    };
    initMap?: () => void;
  }
}

type GoogleMap = {
  setCenter: (pos: { lat: number; lng: number }) => void;
};

type GoogleMarker = {
  map: GoogleMap | null;
  position: { lat: number; lng: number };
  addListener: (event: string, handler: () => void) => void;
};

type GoogleInfoWindow = {
  setContent: (content: string) => void;
  open: (opts: { map: GoogleMap; anchor: GoogleMarker }) => void;
};

const MAP_ID = "live-visitor-map";
const SCRIPT_ID = "google-maps-script";

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject();
    if (window.google?.maps) return resolve();

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function LiveVisitorMap({ apiKey }: { apiKey: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<GoogleMap | null>(null);
  const markers = useRef<GoogleMarker[]>([]);
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !mapRef.current || !window.google) return;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 23.8103, lng: 90.4125 }, // Dhaka
          zoom: 5,
          mapId: MAP_ID,
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });
      })
      .catch(() => {
        setError("Failed to load Google Maps");
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current || !window.google) return;

    // Clear old markers
    markers.current.forEach((m) => {
      m.map = null;
    });
    markers.current = [];

    // Add new markers
    for (const loc of locations) {
      try {
        const pin = new window.google.maps.marker.PinElement({
          background: "#22c55e",
          borderColor: "#16a34a",
          glyphColor: "#ffffff",
          scale: 1.1,
        });

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current,
          position: { lat: loc.latitude, lng: loc.longitude },
          content: pin.element,
          title: `${loc.city || "Unknown"} — ${loc.page}`,
        });

        const info = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family:system-ui;padding:4px;min-width:200px">
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
          `,
        });

        marker.addListener("gmp-click", () => {
          info.open({ map: mapInstance.current!, anchor: marker });
        });

        markers.current.push(marker);
      } catch {}
    }
  }, [locations]);

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-center">
        <div>
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 rounded-xl">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
      <div
        ref={mapRef}
        className="h-[400px] w-full overflow-hidden rounded-xl border border-border/60"
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
