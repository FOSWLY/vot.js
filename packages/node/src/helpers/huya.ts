import { BaseHelper, VideoHelperError } from "./base";
const huyaUrlPattern =
  /^https?:\/\/(?:www\.)?huya\.com\/video\/play\/(?<id>\d+)\.html(?=$|[\/?#])/;
export function parseHuyaVideoId(url: string): string | undefined {
  const id = huyaUrlPattern.exec(url)?.groups?.id;
  return id;
}
export default class HuyaHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseHuyaVideoId(url.href);
  }
  async getVideoData(videoId: string) {
    if (!this.service) return undefined;
    return {
      ...this.returnBaseData(videoId)!,
      url: this.service.url + videoId + ".html",
    };
  }
}
