import { NativeDeltaHelper } from "./nativeDelta";

export default class DailyMailHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return /^https?:\/\/(?:www\.)?dailymail\.co\.uk\/(?:video\/[^/]+\/video-|embed\/video\/)(?<id>[0-9]+)(?=\.html(?:$|[?#])|[/?#]|$)/.exec(
      url.href,
    )?.groups?.id;
  }
}
