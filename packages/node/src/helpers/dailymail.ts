import { BaseHelper, VideoHelperError } from "./base";
const dailymailUrlPattern = new RegExp(
  "^https?://(?:www\\.)?dailymail\\.co\\.uk/(?:video/[^/]+/video-|embed/video/)(?<id>[0-9]+)(?=\\.html(?:$|[?#])|[/?#]|$)",
);
export function parseDailyMailVideoId(url: string): string | undefined {
  return dailymailUrlPattern.exec(url)?.groups?.id;
}
export default class DailyMailHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseDailyMailVideoId(url.href);
  }
  async getVideoData(videoId: string) {
    if (!this.service) return undefined;
    return {
      ...this.returnBaseData(videoId)!,
      url: this.service.url + videoId + ".html",
    };
  }
}
