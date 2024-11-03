import { BaseHelper } from "./base";
import * as Kick from "../types/helpers/kick";
import { MinimalVideoData } from "../types/client";
import Logger from "../utils/logger";

export default class KickHelper extends BaseHelper {
  API_ORIGIN = "https://kick.com/api";

  async getClipInfo(clipId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/v2/clips/${clipId}`);
      const data = (await res.json()) as Kick.ClipResponse;
      const { clip_url: url, duration, title } = data.clip;
      return {
        url,
        duration,
        title,
      };
    } catch (err: unknown) {
      Logger.error(
        `Failed to get kick clip info by clipId: ${clipId}.`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getVideoInfo(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/v1/video/${videoId}`);
      const data = (await res.json()) as Kick.VideoResponse;
      const { source: url, livestream } = data;
      const { session_title: title, duration } = livestream;
      return {
        url,
        duration: Math.round(duration / 1000),
        title,
      };
    } catch (err: unknown) {
      Logger.error(
        `Failed to get kick video info by videoId: ${videoId}.`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return videoId.startsWith("videos")
      ? await this.getVideoInfo(videoId.replace("videos/", ""))
      : await this.getClipInfo(videoId.replace("clips/", ""));
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /([^/]+)\/((videos|clips)\/([^/]+))/.exec(url.pathname)?.[2];
  }
}
