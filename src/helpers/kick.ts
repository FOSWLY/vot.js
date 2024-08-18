import sites from "../config/sites";
import { BaseHelper } from "./base";
import * as Kick from "../types/helpers/kick";
import { VideoService } from "../types/yandex";

export default class KickHelper extends BaseHelper {
  API_ORIGIN = "https://kick.com/api/v2";

  async getClipInfo(clipId: string): Promise<false | Kick.Response> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/clips/${clipId}`);

      return (await res.json()) as Kick.Response;
    } catch (err: unknown) {
      console.error(
        `Failed to get kick clip info by clipId: ${clipId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string) {
    if (!videoId.startsWith("clip_")) {
      // video can be translated by api by default
      return {
        url: sites.find((s) => s.host === VideoService.kick)!.url + videoId,
      };
    }

    const clipInfo = await this.getClipInfo(videoId);
    if (!clipInfo) {
      return undefined;
    }

    const { clip_url, duration, title } = clipInfo.clip;

    return {
      url: clip_url,
      duration,
      title,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const videoId = /video\/([^/]+)/.exec(url.pathname)?.[0];
    if (videoId) {
      return videoId;
    }

    return url.searchParams.get("clip") ?? undefined;
  }
}
