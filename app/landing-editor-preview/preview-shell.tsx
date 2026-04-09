"use client";

import { useEffect, useState } from "react";
import { TEMPLATE_COMPONENTS } from "@/lib/landing-templates";
import {
  EMPTY_LANDING_CONTENT,
  type LandingTemplate,
} from "@/schemas/landing";
import type {
  LandingProductLite,
  LandingViewModel,
} from "@/components/landing/templates/types";

type PreviewState = {
  landing: LandingViewModel;
  product: LandingProductLite | null;
  template: LandingTemplate;
};

type IncomingMessage = {
  type: "landing-preview-update";
  state: PreviewState;
};

const INITIAL: PreviewState = {
  template: "classic",
  product: null,
  landing: {
    id: "preview",
    slug: "",
    title: "",
    template: "classic",
    videoUrl: null,
    content: EMPTY_LANDING_CONTENT,
  },
};

export function PreviewShell() {
  const [state, setState] = useState<PreviewState>(INITIAL);

  useEffect(() => {
    function handler(event: MessageEvent<IncomingMessage>) {
      if (event.data?.type === "landing-preview-update") {
        setState(event.data.state);
      }
    }
    window.addEventListener("message", handler);

    // Tell parent we're ready to receive data
    window.parent?.postMessage(
      { type: "landing-preview-ready" },
      window.location.origin
    );

    return () => window.removeEventListener("message", handler);
  }, []);

  const Template =
    TEMPLATE_COMPONENTS[state.template] ?? TEMPLATE_COMPONENTS.classic;

  if (!state.product) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/40 p-8 text-center">
        <div>
          <p className="text-sm italic text-muted-foreground">
            Pick a product to preview
          </p>
          <p className="mt-1 text-base">Preview will appear here</p>
        </div>
      </div>
    );
  }

  return (
    // Capture submits so the order form inside the preview never actually
    // posts an order from the editor.
    <div onSubmitCapture={(e) => e.preventDefault()}>
      <Template landing={state.landing} product={state.product} />
    </div>
  );
}
