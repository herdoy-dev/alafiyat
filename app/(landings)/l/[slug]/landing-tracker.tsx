"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/pixel";

export function LandingTracker({
  productId,
  value,
}: {
  productId: string;
  value: number;
}) {
  useEffect(() => {
    trackViewContent(productId, value);
  }, [productId, value]);
  return null;
}
