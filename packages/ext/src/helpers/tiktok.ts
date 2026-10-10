import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import type {
  ReactFiberProp,
  TikTokPlayerInFiber,
} from "../types/helpers/tiktok";

export default class TikTokHelper extends BaseHelper {
  static PLAYER_CLASS = ".tiktok-web-player";

  static getPlayer(video?: HTMLVideoElement) {
    const playerEl = video?.closest<
      HTMLElement & {
        [key: ReactFiberProp]: TikTokPlayerInFiber;
      }
    >(TikTokHelper.PLAYER_CLASS);
    if (!playerEl) {
      return undefined;
    }

    const playerFiberKey = Object.keys(playerEl).find((key) =>
      key.startsWith("__reactFiber$"),
    ) as `__reactFiber$${string}`;

    const returnNode = playerEl[playerFiberKey]?.return;
    return {
      videoDetail: returnNode?.return?.memoizedProps,
      player: returnNode?.memoizedProps?.player,
    };
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const playerData = TikTokHelper.getPlayer(this.video);
      if (!playerData) {
        return this.returnBaseData(videoId);
      }

      const videoDetail = playerData.videoDetail;
      const duration =
        videoDetail?.videoSource.duration ??
        playerData.player?.bitrateList?.[0]?.duration;

      const subtitles = videoDetail?.subtitleList.map<VideoDataSubtitle>(
        (item) => ({
          source: "tiktok",
          format: "vtt",
          language: normalizeLang(item.language),
          url: item.url[1],
        }),
      );
      return {
        ...this.returnBaseData(videoId)!,
        duration,
        subtitles,
      };
    } catch {
      return this.returnBaseData(videoId);
    }
  }

  async getVideoId(url: URL) {
    const videoId = /([^/]+)\/video\/([^/]+)/.exec(url.pathname)?.[0];
    if (videoId) {
      return videoId;
    }

    const playerEl = this.video?.closest(TikTokHelper.PLAYER_CLASS);
    if (!playerEl) {
      return undefined;
    }

    const parsedVideoId = /xgwrapper-\d+-(\d+)/.exec(playerEl.id)?.[1];
    if (!parsedVideoId) {
      return undefined;
    }

    // we use getAttr because .href returns abs link
    const authorUsername = playerEl
      .closest('[data-e2e="feed-video"]')
      ?.parentElement?.querySelector<HTMLLinkElement>(
        '[data-e2e="video-author-avatar"]',
      )
      ?.getAttribute("href")
      ?.slice(1);
    if (!authorUsername) {
      return undefined;
    }

    return `${authorUsername}/video/${parsedVideoId}`;
  }
}
