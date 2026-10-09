import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";

export type PlayerMediaSource = {
  src?: string | null;
  type?: string | null;
  height?: number | null;
  label?: string | null;
};

export type PlayerTrackSource = {
  src?: string | null;
  lang?: string | null;
  kind?: string | null;
  format?: string | null;
};

const STREAM_TYPES = new Set([
  "application/x-mpegurl",
  "application/vnd.apple.mpegurl",
  "audio/mpegurl",
  "application/dash+xml",
]);
const STREAM_EXT_RE = /\.(?:m3u8|mpd)(?:$|[?#])/i;
// "thumbnails" is used by JW Player (and others) for preview sprite .vtt files
const IGNORED_TRACK_KINDS = new Set([
  "metadata",
  "chapters",
  "descriptions",
  "thumbnails",
]);

export function toAbsoluteUrl(src?: string | null): string | undefined {
  if (!src || /^(?:blob|data|mediastream):/i.test(src)) {
    return undefined;
  }

  try {
    return new URL(src, window.location.href).toString();
  } catch {
    return undefined;
  }
}

export function isStreamSource(source: PlayerMediaSource) {
  const type = source.type?.toLowerCase().split(";")[0].trim();
  if (type && (STREAM_TYPES.has(type) || type === "hls" || type === "dash")) {
    return true;
  }

  return STREAM_EXT_RE.test(source.src ?? "");
}

export function getSourceHeight(source: PlayerMediaSource) {
  if (typeof source.height === "number" && source.height > 0) {
    return source.height;
  }

  const match = /(\d{3,4})\s*p\b/i.exec(source.label ?? "");
  return match ? Number.parseInt(match[1], 10) : 0;
}

/**
 * Picks the best direct media url for translation:
 * progressive mp4/webm sources are preferred over HLS/DASH manifests
 * and the lowest known quality is used to reduce download size
 */
export function selectSourceUrl(
  sources: PlayerMediaSource[],
): string | undefined {
  const seen = new Set<string>();
  const valid: (PlayerMediaSource & { src: string })[] = [];
  for (const source of sources) {
    const src = toAbsoluteUrl(source?.src);
    if (!src || seen.has(src)) {
      continue;
    }

    seen.add(src);
    valid.push({ ...source, src });
  }

  const progressive = valid.filter((source) => !isStreamSource(source));
  const pool = progressive.length ? progressive : valid;
  return [...pool].sort((a, b) => {
    const heightA = getSourceHeight(a);
    const heightB = getSourceHeight(b);
    if (heightA === heightB) return 0;
    if (!heightA) return 1;
    if (!heightB) return -1;
    return heightA - heightB;
  })[0]?.src;
}

export function getFiniteDuration(...values: unknown[]): number | undefined {
  for (const value of values) {
    const duration = typeof value === "string" ? Number(value) : value;
    if (
      typeof duration === "number" &&
      Number.isFinite(duration) &&
      duration > 0
    ) {
      return duration;
    }
  }

  return undefined;
}

export function safeCall<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export function isMediaElement(value: unknown): value is HTMLMediaElement {
  return (
    typeof HTMLMediaElement !== "undefined" && value instanceof HTMLMediaElement
  );
}

export function findMediaElement(
  root?: ParentNode | null,
  selector = "video, audio",
): HTMLMediaElement | undefined {
  if (isMediaElement(root)) {
    return root;
  }

  return root?.querySelector<HTMLMediaElement>(selector) ?? undefined;
}

export function getMediaElementSources(
  media?: HTMLMediaElement | null,
): PlayerMediaSource[] {
  if (!media) {
    return [];
  }

  return [
    { src: media.currentSrc },
    { src: media.getAttribute("src") },
    ...Array.from(media.querySelectorAll<HTMLSourceElement>("source[src]")).map(
      (source) => ({
        src: source.getAttribute("src"),
        type: source.getAttribute("type"),
        label:
          source.getAttribute("label") ??
          source.getAttribute("title") ??
          source.getAttribute("size") ??
          source.getAttribute("res"),
      }),
    ),
  ];
}

export function getTrackElements(
  ...roots: (ParentNode | null | undefined)[]
): PlayerTrackSource[] {
  return roots.flatMap((root) =>
    root
      ? Array.from(root.querySelectorAll<HTMLTrackElement>("track[src]")).map(
          (track) => ({
            src: track.getAttribute("src"),
            lang: track.srclang || track.getAttribute("srclang"),
            kind: track.kind || track.getAttribute("kind"),
          }),
        )
      : [],
  );
}

function getSubtitleFormat(
  track: PlayerTrackSource,
  url: string,
): VideoDataSubtitle["format"] | undefined {
  const format = (
    track.format ?? /\.(\w+)(?:$|[?#])/.exec(new URL(url).pathname)?.[1]
  )?.toLowerCase();
  if (!format || format === "vtt" || format === "webvtt") {
    return "vtt";
  }

  if (format === "srt") {
    return "srt";
  }

  // ass, ssa, ttml and other formats aren't supported by vot.js
  return undefined;
}

export function buildSubtitles(
  tracks: PlayerTrackSource[],
  source: string,
): VideoDataSubtitle[] {
  const seen = new Set<string>();
  return tracks.flatMap((track) => {
    const kind = track?.kind?.toLowerCase();
    const url = toAbsoluteUrl(track?.src);
    if (!url || seen.has(url) || (kind && IGNORED_TRACK_KINDS.has(kind))) {
      return [];
    }

    const format = getSubtitleFormat(track, url);
    if (!format) {
      return [];
    }

    seen.add(url);
    return [
      {
        language: normalizeLang(track.lang ?? "") ?? "",
        source,
        format,
        url,
      } satisfies VideoDataSubtitle,
    ];
  });
}

/**
 * Builds the common player result: translation is requested for the page (videoId)
 * and the direct media file is passed as a translation help
 */
export function buildVideoData(
  videoId: string,
  fileUrl: string | undefined,
  duration: number | undefined,
  subtitles: VideoDataSubtitle[],
): MinimalVideoData {
  if (!fileUrl) {
    throw new Error("Failed to find video url");
  }

  return {
    url: videoId,
    duration,
    translationHelp: [{ target: "video_file_url", targetUrl: fileUrl }],
    subtitles,
  };
}

/**
 * Some players (Clappr, DPlayer) don't keep a global instance registry,
 * so we look for an instance assigned to a global variable (e.g. `window.player`)
 */
export function findGlobalInstance<T>(
  predicate: (value: unknown) => value is T,
  preferredKeys: string[] = [],
): T | undefined {
  const keys = new Set([...preferredKeys, ...Object.keys(window)]);
  for (const key of keys) {
    const value = safeCall(
      () => (window as unknown as Record<string, unknown>)[key],
    );
    if (value && typeof value === "object" && safeCall(() => predicate(value))) {
      return value as T;
    }
  }

  return undefined;
}
