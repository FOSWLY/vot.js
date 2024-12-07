import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import * as EpicGames from "@vot.js/shared/types/helpers/epicgames";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class EpicGamesHelper extends BaseHelper {
  API_ORIGIN = "https://dev.epicgames.com/community/api/learning";

  async getPostInfo(videoId: string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/post.json?hash_id=${videoId}`,
      );

      return (await res.json()) as EpicGames.Post;
    } catch (err: unknown) {
      Logger.error(
        `Failed to get epicgames post info by videoId: ${videoId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async fetchPlaylistUrl(embedId: string) {
    try {
      const res = await this.fetch(
        `https://dev.epicgames.com/community/api/cms/videos/${embedId}/embed.html`,
      );
      const content = await res.text();
      const playlistUrl = /videoUrl\s?=\s"([^"]+)"?/.exec(content);
      return playlistUrl?.[1]?.replace("qsep://", "https://");
    } catch (err) {
      Logger.error(
        `Failed to get playlist url by embed Id ${embedId}, because: ${
          (err as Error).message
        }`,
      );
      return undefined;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const postInfo = await this.getPostInfo(videoId);
    if (!postInfo) {
      return undefined;
    }

    const videoBlock = postInfo.blocks.find((block) => block.type === "video");
    if (!videoBlock) {
      return undefined;
    }

    const playlistUrl = await this.fetchPlaylistUrl(videoBlock.video_id);
    if (!playlistUrl) {
      return undefined;
    }

    const { title, description } = postInfo;

    // url returns a json containing a dash playlist (in base64) in the playlist field
    return {
      url: playlistUrl,
      title,
      description,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(\w{3,5})\/[^/]+$/.exec(url.pathname)?.[1];
  }
}
