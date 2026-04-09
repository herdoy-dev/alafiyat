import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PreviewShell } from "./preview-shell";

// Renders the landing template inside an iframe for the admin editor.
// Receives the live landing/product/template data via window.postMessage from
// the parent window (the LandingPreview component in the admin form).
//
// Lives outside /admin so it doesn't inherit the admin sidebar/nav layout —
// the iframe needs to be a fully standalone document with its own viewport
// width so Tailwind responsive breakpoints fire at the device width.
export default async function LandingEditorPreviewPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return <PreviewShell />;
}
