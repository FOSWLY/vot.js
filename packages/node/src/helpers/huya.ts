import { BaseHelper } from "./base";

export default class HuyaHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !/^(?:www\.)?huya\.com$/.test(url.hostname)
    )
      return undefined;
    return /^\/video\/play\/(?<id>\d+)\.html(?=$|[/?#])/.exec(url.pathname)
      ?.groups?.id;
  }
  async getVideoData(videoId: string) {
    if (!this.service) return undefined;
    return {
      ...this.returnBaseData(videoId)!,
      url: this.service.url + videoId + ".html",
    };
  }
}
