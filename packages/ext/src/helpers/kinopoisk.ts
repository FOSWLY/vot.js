import type { MinimalVideoData } from "../types/client";
import { ExtVideoService } from "../types/service";
import { BaseHelper, VideoHelperError } from "./base";

const CATALOG_HOST_RE = /^(?:www\.)?kinopoisk\.ru$/;
const MEDIA_HOST_RE = /(?:^|\.)(?:yandex\.(?:ru|net)|kinopoisk\.ru)$/;
const PLAYER_SELECTOR = '[id^="ya-video-player-"]';
const MAX_RESOURCES = 128;
const SOURCE_WAIT_ATTEMPTS = 10;
const SOURCE_WAIT_INTERVAL = 250;

type MediaKind = "hls" | "file" | "dash";
type Resource = { url: string; time: number };
type PageState = {
  resources: Map<string, number>;
  encryptedVideos: WeakSet<HTMLVideoElement>;
};
const pageStates = new WeakMap<Document, PageState>();

/** Only catalogue pages and their embedded trailer player are supported. */
export function isKinopoiskUrl(url: URL, referer = ""): boolean {
  if (url.protocol !== "https:") return false;
  if (CATALOG_HOST_RE.test(url.hostname)) return true;
  if (url.hostname !== "frontend.vh.yandex.ru") return false;
  try {
    const parent = new URL(referer);
    return (
      parent.protocol === "https:" && CATALOG_HOST_RE.test(parent.hostname)
    );
  } catch {
    return false;
  }
}

function mediaKind(value: string): MediaKind | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !MEDIA_HOST_RE.test(url.hostname)) return;
    if (/\.m3u8$/i.test(url.pathname)) return "hls";
    if (/\.mpd$/i.test(url.pathname)) return "dash";
    if (/\.(?:mp4|webm)$/i.test(url.pathname)) {
      // fMP4 initialization fragments and HLS segments aren't complete videos.
      if (
        /\/(?:init(?:[-_.][^/]*)?|(?:seg|segment|chunk|frag)[-_.]?\d[^/]*)\.mp4$/i.test(
          url.pathname,
        )
      )
        return;
      if (/\bstream_type=HLS\b/i.test(url.pathname)) return;
      return "file";
    }
  } catch {
    // blob URLs and non-media resources aren't usable by the translation API.
  }
}

function contentId(value: string): string {
  const url = new URL(value);
  const content = /\/(?:ott-content|vod-content)\/([^/]+)/.exec(
    url.pathname,
  )?.[1];
  // CDN hosts, renditions, signatures and player sessions can change on reload.
  return content
    ? `kinopoisk:${content}`
    : `kinopoisk:${url.origin}${url.pathname}`;
}

function recordResource(state: PageState, entry: PerformanceEntry) {
  if (!mediaKind(entry.name)) return;
  state.resources.set(entry.name, entry.startTime);
  while (state.resources.size > MAX_RESOURCES) {
    const oldest = state.resources.keys().next().value;
    if (oldest === undefined) break;
    state.resources.delete(oldest);
  }
}

function getPageState(): PageState {
  const existing = pageStates.get(document);
  if (existing) return existing;
  const state: PageState = {
    resources: new Map(),
    encryptedVideos: new WeakSet(),
  };
  pageStates.set(document, state);
  performance
    .getEntriesByType("resource")
    .forEach((entry) => recordResource(state, entry));
  try {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => recordResource(state, entry));
    }).observe({ type: "resource", buffered: true });
  } catch {
    // Reading the resource buffer still works without PerformanceObserver.
  }
  document.addEventListener(
    "encrypted",
    (event) => {
      if (event.target instanceof HTMLVideoElement)
        state.encryptedVideos.add(event.target);
    },
    true,
  );
  return state;
}

function resourceRank(value: string): number {
  const url = new URL(value);
  if (mediaKind(value) === "file") return 4;
  if (/\/(?:master|manifest)\.m3u8$/i.test(url.pathname)) return 3;
  if (/audio[^/]*\.m3u8$/i.test(url.pathname)) return 2;
  return 1;
}

function pickResource(
  resources: Resource[],
  session?: string,
): string | undefined {
  const pool = session
    ? resources.filter(
        ({ url }) => new URL(url).searchParams.get("vsid") === session,
      )
    : resources;
  if (!pool.length) return;
  // Without a player session we cannot distinguish a trailer from a preloaded
  // video or an advertisement. Never pick an arbitrary resource on such pages.
  if (!session && new Set(pool.map(({ url }) => contentId(url))).size !== 1)
    return;
  const latest = pool.reduce((a, b) => (a.time > b.time ? a : b));
  const activeId = contentId(latest.url);
  return pool
    .filter(({ url }) => contentId(url) === activeId)
    .toSorted(
      (a, b) => resourceRank(b.url) - resourceRank(a.url) || b.time - a.time,
    )[0]?.url;
}

function checkPlaylist(text: string) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim());
  if (lines[0] !== "#EXTM3U")
    throw new VideoHelperError("Invalid Kinopoisk HLS playlist");
  if (
    lines.some(
      (line) =>
        /^#EXT-X-(?:SESSION-)?KEY:/i.test(line) &&
        !/(?:^|[:,])\s*METHOD=NONE(?:,|$)/i.test(line),
    )
  ) {
    throw new VideoHelperError("Encrypted Kinopoisk videos are not supported");
  }
  return lines;
}

/** Extracts an unencrypted VOD source from the currently opened trailer player. */
export default class KinopoiskHelper extends BaseHelper {
  private state?: PageState;

  private getVideo(): HTMLVideoElement | undefined {
    if (!isKinopoiskUrl(new URL(window.location.href), document.referrer))
      return;
    this.state ??= getPageState();
    if (this.video) return this.video;
    const videos = document.querySelectorAll<HTMLVideoElement>("video");
    return videos.length === 1 ? videos[0] : undefined;
  }

  private findSource(video: HTMLVideoElement): string | undefined {
    const direct = [
      video.currentSrc,
      video.src,
      ...Array.from(
        video.querySelectorAll<HTMLSourceElement>("source[src]"),
        (source) => source.src,
      ),
    ].find((value) => mediaKind(value));
    if (direct) return direct;
    const state = this.state;
    if (!state) return;
    performance
      .getEntriesByType("resource")
      .forEach((entry) => recordResource(state, entry));
    const session = video
      .closest(PLAYER_SELECTOR)
      ?.id.slice("ya-video-player-".length);
    if (!session && document.querySelectorAll("video").length !== 1) return;
    // Only content resources can be considered when the DOM points to a blob.
    const resources = Array.from(state.resources, ([url, time]) => ({
      url,
      time,
    })).filter(({ url }) =>
      /\/(?:ott-content|vod-content)\//.test(new URL(url).pathname),
    );
    return pickResource(resources, session);
  }

  private isEncrypted(video: HTMLVideoElement): boolean {
    return (
      Boolean(video.mediaKeys) ||
      Boolean(this.state?.encryptedVideos.has(video))
    );
  }

  private async waitForSource(
    video: HTMLVideoElement,
  ): Promise<string | undefined> {
    for (let attempt = 0; attempt <= SOURCE_WAIT_ATTEMPTS; attempt++) {
      if (!video.isConnected || this.isEncrypted(video)) return;
      const source = this.findSource(video);
      if (source) return source;
      if (attempt === SOURCE_WAIT_ATTEMPTS) return;
      await new Promise((resolve) => setTimeout(resolve, SOURCE_WAIT_INTERVAL));
    }
  }

  private async fetchPlaylist(
    url: string,
  ): Promise<{ lines: string[]; url: string }> {
    const response = await this.fetch(url);
    if (!response.ok)
      throw new VideoHelperError(
        `Kinopoisk playlist request failed: ${response.status}`,
      );
    return {
      lines: checkPlaylist(await response.text()),
      url: response.url || url,
    };
  }

  private async validateSource(url: string): Promise<number | undefined> {
    const kind = mediaKind(url);
    if (kind === "dash")
      throw new VideoHelperError("Kinopoisk DASH videos are not supported");
    if (kind !== "hls") return;
    let playlist = await this.fetchPlaylist(url);
    if (playlist.lines.some((line) => line.startsWith("#EXT-X-STREAM-INF:"))) {
      const audioTracks = playlist.lines.filter(
        (line) =>
          line.startsWith("#EXT-X-MEDIA:") &&
          /(?:^|,)TYPE=AUDIO(?:,|$)/.test(line.slice(13)),
      );
      const audio =
        audioTracks.find((line) =>
          /(?:^|,)DEFAULT=YES(?:,|$)/.test(line.slice(13)),
        ) ?? audioTracks[0];
      const child =
        (audio ? /URI="([^"]+)"/.exec(audio)?.[1] : undefined) ??
        playlist.lines.find((line) => line && !line.startsWith("#"));
      if (!child)
        throw new VideoHelperError(
          "Kinopoisk HLS master has no media playlist",
        );
      const childUrl = new URL(child, playlist.url).href;
      if (mediaKind(childUrl) !== "hls")
        throw new VideoHelperError("Unsupported Kinopoisk media playlist URL");
      playlist = await this.fetchPlaylist(childUrl);
    }
    if (
      !playlist.lines.includes("#EXT-X-ENDLIST") ||
      playlist.lines.some((line) => line.startsWith("#EXT-X-STREAM-INF:"))
    ) {
      throw new VideoHelperError(
        "Only Kinopoisk HLS VOD playlists are supported",
      );
    }
    const durations = playlist.lines
      .filter((line) => line.startsWith("#EXTINF:"))
      .map((line) => Number.parseFloat(line.slice(8)));
    if (
      !durations.length ||
      durations.some((duration) => !Number.isFinite(duration) || duration < 0)
    ) {
      throw new VideoHelperError(
        "Kinopoisk media playlist has no valid segments",
      );
    }
    const duration = durations.reduce((sum, segment) => sum + segment, 0);
    return duration > 0 ? duration : undefined;
  }

  async getVideoId(_url: URL): Promise<string | undefined> {
    const video = this.getVideo();
    if (!video) return;
    const source = await this.waitForSource(video);
    return source ? contentId(source) : undefined;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const video = this.getVideo();
    if (!video) return;
    if (this.isEncrypted(video))
      throw new VideoHelperError("Kinopoisk DRM videos are not supported");
    const source = await this.waitForSource(video);
    if (!source)
      throw new VideoHelperError(
        "Kinopoisk trailer source was not found; start playback first",
      );
    if (contentId(source) !== videoId)
      throw new VideoHelperError("Kinopoisk video changed during extraction");
    const currentSrc = video.currentSrc;
    const playlistDuration = await this.validateSource(source);
    if (this.isEncrypted(video))
      throw new VideoHelperError("Kinopoisk DRM videos are not supported");
    const currentSource = this.findSource(video);
    if (
      !video.isConnected ||
      video.currentSrc !== currentSrc ||
      !currentSource ||
      contentId(currentSource) !== videoId
    ) {
      throw new VideoHelperError("Kinopoisk video changed during extraction");
    }
    return {
      url: source,
      host: ExtVideoService.kinopoisk,
      isStream: false,
      duration:
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : playlistDuration,
      title: this.extraInfo ? document.title : undefined,
    };
  }
}
