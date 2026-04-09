/**
 * Extract a YouTube video ID from any common URL form:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   plain VIDEO_ID
 * Returns null if nothing recognisable is found.
 */
export function extractYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Already a bare 11-char id
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    );
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      // /watch?v=
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      // /embed/, /shorts/, /v/
      const segments = url.pathname.split("/").filter(Boolean);
      const idIdx = segments.findIndex((s) =>
        ["embed", "shorts", "v"].includes(s)
      );
      if (idIdx >= 0 && segments[idIdx + 1]) {
        const id = segments[idIdx + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function getYouTubeEmbedUrl(input: string | null | undefined): string | null {
  const id = extractYouTubeId(input);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}
