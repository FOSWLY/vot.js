import type * as Vimeo from "@vot.js/shared/types/helpers/vimeo";
import Logger from "@vot.js/shared/utils/logger";
import type * as Dropout from "../types/helpers/dropout";
import { VideoHelperError } from "./base";
import VimeoHelper from "./vimeo";

const CONFIG_URL_RE =
  /^https:\/\/player\.vimeo\.com\/video\/[a-z0-9_-]+\/config/i;
const CONFIG_WAIT_TIMEOUT = 10_000;
const CONFIG_WAIT_INTERVAL = 500;

function isPlayerConfig(data: unknown): data is Dropout.PlayerConfig {
  if (!data || typeof data !== "object") {
    return false;
  }

  const config = data as Dropout.PlayerConfig;
  return Boolean(
    (config.request?.files || config.files) && (config.video || config.request),
  );
}

function normalizeConfigUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  let url = value
    .replaceAll("\\/", "/")
    .replaceAll("\\u0026", "&")
    .replaceAll("&amp;", "&");
  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  if (url.startsWith("/video/")) {
    url = `https://player.vimeo.com${url}`;
  }

  return CONFIG_URL_RE.test(url) ? url : undefined;
}

/**
 * Dropout embeds a private Vimeo player on embed.vhx.tv. The page doesn't
 * expose `playerConfig`, so the player config url is searched in the loaded
 * resources and in the page markup, then requested directly.
 */
function findConfigUrl() {
  const candidates: string[] = [];
  try {
    candidates.push(
      ...performance.getEntriesByType("resource").map((entry) => entry.name),
    );
  } catch {
    // performance api can be unavailable
  }

  candidates.push(
    ...Array.from(
      document.querySelectorAll<HTMLIFrameElement | HTMLScriptElement>(
        "iframe[src], script[src]",
      ),
      (el) => el.src,
    ),
  );

  const html = document.documentElement?.innerHTML ?? "";
  candidates.push(
    // also matches JSON-escaped urls (https:\/\/...), stops before the next
    // escape sequence
    ...(html.match(
      /https?:\\?\/\\?\/player\.vimeo\.com\\?\/video\\?\/\d+\\?\/config[^"'<>\s\\]*/gi,
    ) ?? []),
    ...(html.match(/\/video\/\d+\/config[^"'<>\s]*/gi) ?? []),
  );

  return candidates.map(normalizeConfigUrl).find(Boolean);
}

function getDomTextTracks() {
  return Array.from(
    document.querySelectorAll<HTMLTrackElement>(
      'track[src][kind="captions"], track[src][kind="subtitles"]',
    ),
    (track) => ({
      lang: track.srclang || track.getAttribute("srclang") || "auto",
      url: track.src,
      kind: track.kind,
    }),
  ).filter((track) => Boolean(track.url));
}

function getCdnUrl(group?: Dropout.CdnGroup) {
  return (
    (group?.default_cdn ? group.cdns?.[group.default_cdn]?.url : undefined) ??
    Object.values(group?.cdns ?? {})[0]?.url
  );
}

function distanceTo360p(item: Dropout.ProgressiveFile) {
  return Math.abs((item.height ?? 360) - 360);
}

function getTrackCodec(track: Dropout.DashTrack) {
  return [track.codecs, track.codec, track.mime_type, track.id, track.quality]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default class DropoutHelper extends VimeoHelper {
  private config?: Dropout.PlayerConfig;

  isPrivatePlayer() {
    return true;
  }

  async fetchConfig(configUrl: string) {
    try {
      const res = await this.fetch(configUrl, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        throw new VideoHelperError(
          `Vimeo config request failed: ${res.status}`,
        );
      }

      const config = (await res.json()) as unknown;
      return isPlayerConfig(config) ? config : undefined;
    } catch (err) {
      Logger.error(
        "Failed to fetch Dropout player config",
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getConfig() {
    if (this.config) {
      return this.config;
    }

    if (typeof playerConfig !== "undefined" && isPlayerConfig(playerConfig)) {
      this.config = playerConfig;
      return this.config;
    }

    const deadline = Date.now() + CONFIG_WAIT_TIMEOUT;
    let configUrl = findConfigUrl();
    while (!configUrl && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, CONFIG_WAIT_INTERVAL));
      configUrl = findConfigUrl();
    }

    if (!configUrl) {
      return undefined;
    }

    this.config = await this.fetchConfig(configUrl);
    return this.config;
  }

  async getDashAudioSource(dashCdnUrl: string) {
    const res = await this.fetch(dashCdnUrl);
    if (res.status !== 200) {
      throw new VideoHelperError(await res.text());
    }

    const data = (await res.json()) as Dropout.DashConfig;
    const baseUrl = new URL(data.base_url ?? "", dashCdnUrl);
    const tracks = [...(data.audio ?? []), ...(data.video ?? [])].filter(
      (track) => track.format === "dash" && track.segments?.length,
    );
    const audioTracks = tracks.filter(
      (track) => track.mime_type === "audio/mp4",
    );
    const track =
      audioTracks.find((t) => /mp4a|aac/.test(getTrackCodec(t))) ??
      audioTracks.find((t) => !/opus|vorbis/.test(getTrackCodec(t))) ??
      audioTracks[0] ??
      tracks[0];
    if (!track) {
      return undefined;
    }

    const segmentUrl = track.segments?.[0]?.url;
    if (!segmentUrl) {
      throw new VideoHelperError("Failed to find first segment url");
    }

    const [segmentName, segmentParams = ""] = segmentUrl.split("?", 2);
    const params = new URLSearchParams(segmentParams);
    params.delete("range");
    const query = params.toString();
    return new URL(
      `${track.base_url ?? ""}${segmentName}${query ? `?${query}` : ""}`,
      baseUrl,
    ).href;
  }

  async getPrivateVideoSource(files?: Dropout.Files) {
    try {
      // the closest to 360p is enough for translation and the fastest to load
      const progressiveSource = files?.progressive
        ?.filter((item) => item.url)
        .reduce<Dropout.ProgressiveFile | undefined>(
          (best, item) =>
            !best || distanceTo360p(item) < distanceTo360p(best) ? item : best,
          undefined,
        )?.url;
      if (progressiveSource) {
        return progressiveSource;
      }

      const dashCdnUrl = getCdnUrl(files?.dash);
      const hlsSource = files?.hls?.url ?? getCdnUrl(files?.hls);
      // dash with query string ranges can't be used as a single file
      const usesQueryStringRanges =
        /(?:[?&]qsr=1(?:&|$)|\/prot\/cXNyPTE(?:\/|$))/i.test(
          String(dashCdnUrl),
        );
      if (usesQueryStringRanges && hlsSource) {
        return hlsSource;
      }

      if (dashCdnUrl) {
        try {
          const dashSource = await this.getDashAudioSource(dashCdnUrl);
          if (dashSource) {
            return dashSource;
          }
        } catch (err) {
          Logger.error(
            "Failed to get Dropout DASH source, trying HLS",
            (err as Error).message,
          );
        }
      }

      if (hlsSource) {
        return hlsSource;
      }

      throw new VideoHelperError(
        "Failed to find playable private video source",
      );
    } catch (err) {
      Logger.error(
        "Failed to get Dropout private video source",
        (err as Error).message,
      );
      return false;
    }
  }

  async getPrivateVideoInfo(videoId: string) {
    try {
      const config = await this.getConfig();
      if (!config) {
        throw new VideoHelperError("Failed to get Vimeo player config");
      }

      const request = config.request ?? config;
      const videoSource = await this.getPrivateVideoSource(
        request.files ?? config.files,
      );
      if (!videoSource) {
        throw new VideoHelperError("Failed to get private video source");
      }

      const configSubs = request.text_tracks ?? request.textTracks ?? [];
      const subs = configSubs.length
        ? configSubs
        : (getDomTextTracks() as unknown as Vimeo.PrivateVideoSubtitle[]);
      const video = config.video ?? {};
      return {
        url: `${this.SITE_ORIGIN}/${videoId}`,
        video_url: videoSource,
        title: video.title ?? video.name ?? "",
        duration: video.duration ?? 0,
        subs,
      };
    } catch (err) {
      Logger.error(
        `Failed to get Dropout video info by video ID: ${videoId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /videos\/([^/?#]+)/.exec(url.pathname)?.[1] ?? url.pathname;
  }
}
