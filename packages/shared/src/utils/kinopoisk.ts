import type {
  KinopoiskTrailer,
  KinopoiskVideoData,
  KinopoiskVideoRef,
  KinopoiskWidgetState,
} from "../types/helpers/kinopoisk";

/**
 * The trailer player renders HLS through MSE, so `video.currentSrc` is a `blob:` URL
 * that Yandex VOT can't download. The real signed stream URL lives in the widget state:
 * `<script data-state>` (percent-encoded JSON) -> `models.trailers[<trailerId>].streamUrl`.
 */

export class KinopoiskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KinopoiskError";
  }
}

export const KINOPOISK_WIDGET_ORIGIN = "https://widgets.kinopoisk.ru";
export const KINOPOISK_SERVICE_URL = `${KINOPOISK_WIDGET_ORIGIN}/discovery/`;
export const KINOPOISK_REFERER = "https://www.kinopoisk.ru/";

const SITE_HOST_RE = /^(www\.)?kinopoisk\.ru$/;
const VIDEO_ID_RE = /^(?:(?:film|series)\/(\d+)\/)?trailer\/(\d+)$/;
const WIDGET_PATH_RE =
  /^\/discovery\/(?:(?:film|series)\/(\d+)\/)?trailer\/(\d+)\/?$/;
const SITE_PATH_RE = /^\/(?:film|series)\/(\d+)\/video\/(\d+)\/?$/;
const FILM_PATH_RE = /^\/(?:film|series)\/(\d+)\/?$/;
const DRM_RE =
  /(?:^|[/_,=-])(?:drm|cenc|cbcs|widevine|playready|fairplay)(?:[/_,=-]|$)/i;
const PLAYABLE_RE = /\.(?:m3u8|mp4)(?:$|[?#])/i;

function toKinopoiskVideoRef(
  match: RegExpExecArray | null,
): KinopoiskVideoRef | undefined {
  return match?.[2] ? { filmId: match[1], trailerId: match[2] } : undefined;
}

export function parseKinopoiskUrl(url: URL): KinopoiskVideoRef | undefined {
  return toKinopoiskVideoRef(
    url.hostname === "widgets.kinopoisk.ru"
      ? WIDGET_PATH_RE.exec(url.pathname)
      : SITE_HOST_RE.test(url.hostname)
        ? SITE_PATH_RE.exec(url.pathname)
        : null,
  );
}

/** Film id of a film/series page (e.g. the widget title link). */
export function parseKinopoiskFilmId(url: URL) {
  return SITE_HOST_RE.test(url.hostname)
    ? FILM_PATH_RE.exec(url.pathname)?.[1]
    : undefined;
}

export function buildKinopoiskVideoId({
  filmId,
  trailerId,
}: KinopoiskVideoRef) {
  return filmId
    ? `film/${filmId}/trailer/${trailerId}`
    : `trailer/${trailerId}`;
}

export function getKinopoiskVideoId(url: URL) {
  const ref = parseKinopoiskUrl(url);
  return ref ? buildKinopoiskVideoId(ref) : undefined;
}

export function parseKinopoiskVideoId(videoId: string) {
  return toKinopoiskVideoRef(VIDEO_ID_RE.exec(videoId));
}

export function getKinopoiskVideoRef(videoId: string): KinopoiskVideoRef {
  const ref = parseKinopoiskVideoId(videoId);
  if (!ref) {
    throw new KinopoiskError(`Invalid Kinopoisk video id: ${videoId}`);
  }

  return ref;
}

export function decodeKinopoiskState(raw: string): KinopoiskWidgetState {
  const text = raw.trim();
  if (!text) {
    throw new KinopoiskError("Kinopoisk player state is empty");
  }

  let json = text;
  if (!text.startsWith("{")) {
    try {
      json = decodeURIComponent(text);
    } catch {
      throw new KinopoiskError("Kinopoisk player state is malformed");
    }
  }

  try {
    const state = JSON.parse(json) as unknown;
    if (!state || typeof state !== "object") {
      throw new Error("not an object");
    }
    return state as KinopoiskWidgetState;
  } catch {
    throw new KinopoiskError("Kinopoisk player state is malformed");
  }
}

/** Extracts the widget state from a full widget HTML page. */
export function parseKinopoiskWidgetHtml(html: string): KinopoiskWidgetState {
  const match = /<script[^>]*\bdata-state\b[^>]*>([\s\S]*?)<\/script>/i.exec(
    html,
  );
  if (!match) {
    throw new KinopoiskError("Kinopoisk player state not found");
  }

  return decodeKinopoiskState(match[1]);
}

/** Loads the widget page of the trailer and extracts its state. */
export async function fetchKinopoiskWidgetState(
  fetchFn: (input: string, init?: RequestInit) => Promise<Response>,
  videoId: string,
): Promise<KinopoiskWidgetState> {
  const res = await fetchFn(KINOPOISK_SERVICE_URL + videoId, {
    headers: { Referer: KINOPOISK_REFERER },
  });
  if (!res.ok) {
    throw new KinopoiskError(
      `Failed to load Kinopoisk player (HTTP ${res.status})`,
    );
  }

  return parseKinopoiskWidgetHtml(await res.text());
}

/** Ref of the first state trailer that satisfies the predicate. */
export function findKinopoiskTrailerRef(
  state: KinopoiskWidgetState | undefined,
  predicate: (trailer: KinopoiskTrailer) => boolean,
): KinopoiskVideoRef | undefined {
  const trailer = Object.values(state?.models?.trailers ?? {}).find(
    (item) => item && predicate(item),
  );
  return trailer
    ? {
        filmId: trailer.filmId ? String(trailer.filmId) : undefined,
        trailerId: String(trailer.id),
      }
    : undefined;
}

export function getKinopoiskTrailer(
  state: KinopoiskWidgetState,
  trailerId: string,
): KinopoiskTrailer & { streamUrl: string } {
  const trailer = state.models?.trailers?.[trailerId];
  if (!trailer) {
    throw new KinopoiskError(`Kinopoisk trailer ${trailerId} not found`);
  }

  const streamUrl = trailer.streamUrl?.trim();
  if (!streamUrl) {
    throw new KinopoiskError("Kinopoisk trailer stream URL is missing");
  }

  let parsed: URL;
  try {
    parsed = new URL(streamUrl, KINOPOISK_WIDGET_ORIGIN);
  } catch {
    throw new KinopoiskError("Kinopoisk trailer stream URL is invalid");
  }

  if (DRM_RE.test(parsed.pathname)) {
    throw new KinopoiskError("Kinopoisk stream is DRM-protected");
  }

  if (!/^https?:$/.test(parsed.protocol) || !PLAYABLE_RE.test(parsed.href)) {
    throw new KinopoiskError(
      "Kinopoisk stream has an unsupported format (expected .m3u8 or .mp4)",
    );
  }

  return { ...trailer, streamUrl: parsed.href };
}

export function toKinopoiskVideoData(
  videoId: string,
  trailer: KinopoiskTrailer & { streamUrl: string },
  duration?: number,
): KinopoiskVideoData {
  const finalDuration =
    duration && Number.isFinite(duration) && duration > 0
      ? duration
      : trailer.duration && trailer.duration > 0
        ? trailer.duration
        : undefined;

  return {
    url: KINOPOISK_SERVICE_URL + videoId,
    videoId,
    duration: finalDuration,
    title: trailer.film?.originalTitle || trailer.film?.title,
    localizedTitle: trailer.film?.title,
    translationHelp: [
      { target: "video_file_url", targetUrl: trailer.streamUrl },
    ],
  };
}

/** Resolves the trailer of the video id from the widget state it loads. */
export async function getKinopoiskVideoData(
  loadState: (videoId: string) => Promise<KinopoiskWidgetState>,
  videoId: string,
  duration?: number,
): Promise<KinopoiskVideoData> {
  const { trailerId } = getKinopoiskVideoRef(videoId);
  const trailer = getKinopoiskTrailer(await loadState(videoId), trailerId);
  return toKinopoiskVideoData(videoId, trailer, duration);
}
