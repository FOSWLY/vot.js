import { NativeDeltaHelper } from "./nativeDelta";
const dailymailUrlPattern = new RegExp(
  "^https?://(?:www\\.)?dailymail\\.co\\.uk/(?:video/[^/]+/video-|embed/video/)(?<id>[0-9]+)(?=\\.html(?:$|[?#])|[/?#]|$)",
);
export function parseDailyMailVideoId(url: string): string | undefined {
  return dailymailUrlPattern.exec(url)?.groups?.id;
}
export default class DailyMailHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseDailyMailVideoId(url.href);
  }
}
