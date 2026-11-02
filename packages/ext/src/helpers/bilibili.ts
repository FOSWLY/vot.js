import { getTimestamp, proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";
import type * as Bilibili from "../types/helpers/bilibili";

type BilibiliWindow = Window & {
  player?: Bilibili.Player;
  __initialState?: Bilibili.PlayInitialState;
};

/**
 * @available only on /video/... and /bangumi/...
 */
const getPlayer = (): Bilibili.Player | undefined => {
  return (window as BilibiliWindow).player;
};

/**
 * @available only on /play/...
 */
const getPlayInitialState = (): Bilibili.PlayInitialState | undefined => {
  return (window as BilibiliWindow).__initialState;
};

const BILIBILI_FNVAL = "4048";

export default class BilibiliHelper extends BaseHelper {
  /**
   * check that link valid because some bilibili m4s urls can return 567 status code
   */
  async checkAudioUrl(url: string): Promise<string | false> {
    if (!url.includes(".m4s")) {
      return false;
    }

    try {
      const res = await this.fetch(url, {
        headers: {
          Range: "bytes=1-1",
        },
      });
      if (!res.ok) {
        throw new Error(
          `Failed to check audio URL: ${res.status} ${res.statusText}`,
        );
      }

      return url;
    } catch (err) {
      Logger.log(`Failed to check audio URL: ${url}`, err);
      return false;
    }
  }

  async parseDash(
    dash: Bilibili.PlayUrlDashData,
  ): Promise<{ duration: number; audioUrl: string }> {
    const { duration, audio: audios } = dash;
    const audio = audios
      .filter((a) => (a.mimeType ?? a.mime_type) === "audio/mp4")
      .sort((a, b) => b.bandwidth - a.bandwidth)[0];
    if (!audio) {
      throw new Error("No audio available");
    }

    // in some cases, one of the spelling options may be missing
    const { baseUrl, base_url, backupUrl, backup_url } = audio;
    const audioUrl =
      (await this.checkAudioUrl(baseUrl ?? base_url)) ??
      (await this.checkAudioUrl(backupUrl?.[0] ?? backup_url?.[0]));
    if (!audioUrl) {
      throw new Error("No valid audio URL found");
    }

    return {
      duration,
      audioUrl,
    };
  }

  async getVideoPlayUrl(bvid: string, cid: number) {
    const params = new URLSearchParams({
      fnval: BILIBILI_FNVAL,
      bvid,
      cid: cid.toString(),
      // required for unauth access
      gaia_source: "pre-load",
      wts: getTimestamp().toString(),
    }).toString();
    const res = await this.fetch(
      `https://api.bilibili.com/x/player/wbi/playurl?${params}`,
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch play URL: ${res.status} ${res.statusText}`,
      );
    }
    const result = (await res.json()) as Bilibili.PlayUrlResponse;
    if (result.code !== 0) {
      throw new Error(
        `Failed to fetch play URL: ${result.message || "Unknown error"}`,
      );
    }

    return await this.parseDash(result.data.dash);
  }

  async getBagumiPlayUrl(seasonId: number, episodeId: number) {
    const params = new URLSearchParams({
      biz_type: "ogv",
      fnval: BILIBILI_FNVAL,
      ep_id: episodeId.toString(),
      season_id: seasonId.toString(),
      wts: getTimestamp().toString(),
    }).toString();
    const res = await this.fetch(
      `https://api.bilibili.com/ogv/player/playview?${params}`,
      {
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch play URL: ${res.status} ${res.statusText}`,
      );
    }
    const result = (await res.json()) as Bilibili.BagumiPlayUrlResponse;
    if (result.code !== 0) {
      throw new Error(
        `Failed to fetch play URL: ${result.message || "Unknown error"}`,
      );
    }

    return await this.parseDash(result.data.video_info.dash);
  }

  async getVideoPageData() {
    const player = getPlayer();
    if (!player) {
      throw new Error("Bilibili player not found");
    }
    const { bvid, cid, seasonId, episodeId } = player.getManifest();
    return bvid !== null
      ? await this.getVideoPlayUrl(bvid, cid)
      : await this.getBagumiPlayUrl(seasonId, episodeId);
  }

  async getPlayPageData() {
    const initialState = getPlayInitialState();
    if (!initialState) {
      throw new Error("Bilibili play page initial state not found");
    }

    const dash = initialState?.player?.playUrl?.value?.dash;
    if (!dash) {
      throw new Error("No dash data found");
    }

    return await this.parseDash(dash);
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    try {
      const playData = videoId.startsWith("play/")
        ? await this.getPlayPageData()
        : await this.getVideoPageData();

      return {
        ...baseData,
        duration: playData.duration,
        translationHelp: [
          {
            target: "video_file_url",
            targetUrl: proxyMedia(playData.audioUrl, "mp4", this.mediaProxy),
          },
        ],
      };
    } catch (err) {
      Logger.warn(
        `Failed to get Bilibili video data by video ID: ${videoId}, because ${
          (err as Error).message
        }. Using clear link instead...`,
      );
      return baseData;
    }
  }

  async getVideoId(url: URL) {
    const playId = /(?:bangumi|cheese)\/play\/[^/]+/.exec(url.pathname)?.[0];
    if (playId) {
      return playId;
    }

    // embed
    const bvid = url.searchParams.get("bvid");
    if (bvid) {
      return `video/${bvid}`;
    }

    // bilibili.tv
    const intlId =
      /^\/(?:[a-z]{2}\/)?((?:play\/\d+(?:\/\d+)?|video\/\d+))\/?$/i.exec(
        url.pathname,
      )?.[1];
    if (intlId) {
      return intlId;
    }

    const vid = /video\/[^/]+/.exec(url.pathname)?.[0];
    if (vid) {
      const p = url.searchParams.get("p");
      return p !== null ? `${vid}/?p=${p}` : vid;
    }

    return undefined;
  }
}
