import type { KinopoiskVideoRef } from "@vot.js/shared/types/helpers/kinopoisk";
import {
  buildKinopoiskVideoId,
  decodeKinopoiskState,
  fetchKinopoiskWidgetState,
  findKinopoiskTrailerRef,
  getKinopoiskVideoData,
  getKinopoiskVideoId,
  KINOPOISK_WIDGET_ORIGIN,
  parseKinopoiskFilmId,
  parseKinopoiskUrl,
  parseKinopoiskVideoId,
} from "@vot.js/shared/utils/kinopoisk";

import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

export * from "@vot.js/shared/utils/kinopoisk";

/** Extracts the widget state from the live widget document (iframe context). */
export function parseKinopoiskWidgetDocument(doc: Document) {
  const raw = doc.querySelector("script[data-state]")?.textContent;
  return raw ? decodeKinopoiskState(raw) : undefined;
}

/** Film id of the trailer shown by the widget (its title links to the film). */
export function getKinopoiskShownFilmId(doc: Document) {
  const link = doc.querySelector<HTMLAnchorElement>(
    'a[href*="kinopoisk.ru/film/"], a[href*="kinopoisk.ru/series/"]',
  );
  return link ? parseKinopoiskFilmId(new URL(link.href)) : undefined;
}

/** Stream content ids loaded by the widget player, newest first. */
export function getKinopoiskLoadedContentIds() {
  return performance
    .getEntriesByType("resource")
    .map((entry) => /\/vod-content\/(\w+)\//.exec(entry.name)?.[1])
    .filter((id): id is string => !!id)
    .reverse();
}

export default class KinopoiskHelper extends BaseHelper {
  API_ORIGIN = KINOPOISK_WIDGET_ORIGIN;

  async getWidgetState(videoId: string) {
    if (window.location.hostname === "widgets.kinopoisk.ru") {
      // the widget switches trailers without reloading, so the inline state
      // can belong to a previous trailer
      const state = parseKinopoiskWidgetDocument(document);
      const ref = parseKinopoiskVideoId(videoId);
      if (ref && state?.models?.trailers?.[ref.trailerId]) {
        return state;
      }
    }

    return fetchKinopoiskWidgetState(this.fetch, videoId);
  }

  /**
   * Trailer pagination (and autoplay of the next trailer) swaps the video
   * without changing the widget URL. The player loads the new stream before
   * the widget re-renders its title, so prefer the last loaded stream and
   * fall back to the film of the title link
   */
  async getShownTrailerRef(ref: KinopoiskVideoRef) {
    const contentIds = getKinopoiskLoadedContentIds();
    const filmId = getKinopoiskShownFilmId(document);
    if (!contentIds.length && (!filmId || filmId === ref.filmId)) {
      return ref;
    }

    const state = await this.getWidgetState(buildKinopoiskVideoId(ref)).catch(
      () => undefined,
    );
    for (const contentId of contentIds) {
      const shown = findKinopoiskTrailerRef(
        state,
        (trailer) => trailer.videoContentId === contentId,
      );
      if (shown) {
        return shown;
      }
    }

    return (
      (filmId &&
        filmId !== ref.filmId &&
        findKinopoiskTrailerRef(
          state,
          (trailer) => String(trailer.filmId) === filmId,
        )) ||
      ref
    );
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      return await getKinopoiskVideoData(
        (id) => this.getWidgetState(id),
        videoId,
        this.video?.duration,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[VOT] KinopoiskHelper error:", message);
      // propagate a typed, user-readable reason (DRM, missing source, ...)
      throw err instanceof VideoHelperError
        ? err
        : new VideoHelperError(message);
    }
  }

  async getVideoId(url: URL) {
    const ref = parseKinopoiskUrl(url);
    if (ref) {
      return buildKinopoiskVideoId(
        url.hostname === "widgets.kinopoisk.ru"
          ? await this.getShownTrailerRef(ref)
          : ref,
      );
    }

    // film page with an embedded trailer iframe: trailer pagination keeps
    // previous iframes in the DOM, so pick the last visible one
    const iframe = Array.from(
      document.querySelectorAll<HTMLIFrameElement>(
        'iframe[src*="widgets.kinopoisk.ru/discovery/"]',
      ),
    ).findLast((frame) => frame.src && frame.getClientRects().length);
    return iframe ? getKinopoiskVideoId(new URL(iframe.src, url)) : undefined;
  }
}
