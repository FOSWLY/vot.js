import { BaseHelper } from "./base";

export default class DailyMailHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return /^https?:\/\/(?:www\.)?dailymail\.co\.uk\/(?:video\/[^/]+\/video-|embed\/video\/)(?<id>[0-9]+)(?=\.html(?:$|[?#])|[/?#]|$)/.exec(
      url.href,
    )?.groups?.id;
  }
  async getVideoData(videoId: string) {
    if (!this.service) return undefined;
    return {
      ...this.returnBaseData(videoId)!,
      url: this.service.url + videoId + ".html",
    };
  }
}
