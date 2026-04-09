import { getYouTubeEmbedUrl } from "@/lib/youtube";

export function YouTubeEmbed({
  url,
  title = "Video",
  className,
}: {
  url: string | null | undefined;
  title?: string;
  className?: string;
}) {
  const embed = getYouTubeEmbedUrl(url);
  if (!embed) return null;

  return (
    <div
      className={
        className ||
        "relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg"
      }
    >
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
