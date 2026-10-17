import type { VideoInfo } from "@vot.js/shared/types/helpers/videopress";
import { BaseHelper } from "./base";

export default class VideoPressHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const videoId = /^\/embed\/([a-z\d]{8})(?:\/|$)/i.exec(url.pathname)?.[1];
    if (!videoId) {
      return undefined;
    }

    const res = await this.fetch(
      `https://public-api.wordpress.com/rest/v1.1/videos/${videoId}`,
      { credentials: "include" },
    );
    if (!res.ok) {
      return undefined;
    }

    const data = (await res.json()) as VideoInfo;
    const file =
      data.files?.hd?.mp4 ??
      data.files?.dvd?.mp4 ??
      data.files?.std?.mp4 ??
      data.original ??
      Object.values(data.files ?? {}).find((file) => file?.hls)?.hls;
    if (!file) {
      return undefined;
    }

    try {
      const stream = new URL(
        file,
        data.file_url_base?.https ?? data.file_url_base?.http,
      );
      return /^https?:$/.test(stream.protocol) ? stream.href : undefined;
    } catch {
      return undefined;
    }
  }
}
