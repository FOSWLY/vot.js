import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";

export function extractDOMSubtitles(
  videoEl: HTMLVideoElement | null,
  sourceName: string,
  format: VideoDataSubtitle["format"] = "vtt"
): VideoDataSubtitle[] {
  const trackEls = videoEl
    ? Array.from(videoEl.querySelectorAll<HTMLTrackElement>("track[src]"))
    : [];

  return trackEls
    .filter((t) => t.kind !== "metadata")
    .flatMap((t) => {
      const src = t.getAttribute("src");
      if (!src) {
        return [];
      }

      const absUrl = new URL(src, window.location.href).toString();
      return [
        {
          language: normalizeLang(t.srclang || ""),
          source: sourceName,
          format,
          url: absUrl,
        } satisfies VideoDataSubtitle,
      ];
    });
}
