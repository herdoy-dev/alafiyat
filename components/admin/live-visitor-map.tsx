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

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const SCRIPT_ID = "google-maps-script";

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.google?.maps) return resolve();

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script failed")));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps) resolve();
      else reject(new Error("google.maps not available"));
    };
    script.onerror = () => reject(new Error("script load error"));
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const infoWindow = useRef<any>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !mapRef.current || !window.google?.maps) return;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 23.8103, lng: 90.4125 }, // Dhaka
          zoom: 6,
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        infoWindow.current = new window.google.maps.InfoWindow();
        setMapReady(true);
      })
      .catch((e) => {
        setError(
          e?.message === "script load error"
            ? "Could not reach Google Maps. Check your API key & enabled APIs."
            : "Failed to load Google Maps"
        );
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapReady || !mapInstance.current || !window.google?.maps) return;

    // Clear old markers
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    // Add new markers using classic Marker (no Map ID required)
    for (const loc of locations) {
      try {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.latitude, lng: loc.longitude },
          map: mapInstance.current,
          title: `${loc.city || "Unknown"} — ${loc.page}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#22c55e",
            fillOpacity: 0.9,
            strokeColor: "#16a34a",
            strokeWeight: 2,
          },
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("click", () => {
          infoWindow.current.setContent(`
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
          `);
          infoWindow.current.open(mapInstance.current, marker);
        });

        markers.current.push(marker);
      } catch {}
    }
  }, [locations, mapReady]);

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-center">
        <div>
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-medium">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ensure &quot;Maps JavaScript API&quot; is enabled in Google Cloud Console.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
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
