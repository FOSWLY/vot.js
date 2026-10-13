import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

/** Native media extraction for additive services; never evaluates page scripts. */
export class NativeDeltaHelper extends BaseHelper {
  async getVideoData(_videoId: string): Promise<MinimalVideoData | undefined> {
    let video = this.video;
    if (!video) {
      const selector = this.service?.selector;
      const containers = selector
        ? Array.from(document.querySelectorAll(selector))
        : [];
      const scoped = new Set<HTMLVideoElement>();
      for (const container of containers) {
        if (container.tagName === "VIDEO")
          scoped.add(container as HTMLVideoElement);
        for (const item of container.querySelectorAll<HTMLVideoElement>(
          "video",
        ))
          scoped.add(item);
      }
      const candidates = containers.length
        ? [...scoped]
        : Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
      if (candidates.length !== 1)
        throw new VideoHelperError(
          "Delta player unavailable or ambiguous; pass the active video element",
        );
      video = candidates[0];
    }
    if (!video || video.mediaKeys)
      throw new VideoHelperError("Protected or unavailable delta player");
    const sourceCandidates = [
      video.currentSrc,
      video.getAttribute("src"),
      ...Array.from(video.querySelectorAll<HTMLSourceElement>("source")).map(
        (s) => s.getAttribute("src"),
      ),
    ];
    // Public Video.js API, scoped to this exact video, not a global first-player guess.
    type PublicPlayer = {
      currentSources?: () => {
        src?: string;
        keySystems?: unknown;
        drm?: unknown;
      }[];
    };
    const page = window as Window & {
      videojs?: { getPlayer?: (id: string) => PublicPlayer | undefined };
    };
    if (video.id && page.videojs?.getPlayer) {
      try {
        const id = video.id.endsWith("_html5_api")
          ? video.id.slice(0, -"_html5_api".length)
          : video.id;
        const player = page.videojs.getPlayer(id);
        const apiSources = player?.currentSources?.() ?? [];
        for (const item of apiSources) {
          if (item.drm || item.keySystems)
            throw new VideoHelperError("Protected player source");
          if (item.src) sourceCandidates.push(item.src);
        }
      } catch (error) {
        if (error instanceof VideoHelperError) throw error;
        // Unready player API falls back only to native sources.
      }
    }
    let source: string | undefined;
    for (const candidate of sourceCandidates) {
      if (!candidate) continue;
      try {
        const url = new URL(candidate, window.location.href);
        if (url.protocol === "http:" || url.protocol === "https:") {
          source = url.href;
          break;
        }
      } catch {
        /* Ignore malformed native sources, never reconstruct tokens. */
      }
    }
    if (!source)
      throw new VideoHelperError(
        "No public HTTP media source; blob-only or protected playback is unsupported",
      );
    const duration =
      Number.isFinite(video.duration) && video.duration >= 0
        ? video.duration
        : undefined;
    return {
      url: source,
      duration,
      title: document.title || undefined,
      isStream: video.duration === Infinity,
    };
  }
}
