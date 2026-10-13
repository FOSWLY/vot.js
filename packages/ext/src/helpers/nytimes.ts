import { NativeDeltaHelper } from "./nativeDelta";
export default class NYTimesHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (
      !/^(?:www\.)?nytimes\.com$|^graphics8\.nytimes\.com$/.test(url.hostname)
    )
      return undefined;
    if (url.hostname === "graphics8.nytimes.com") {
      return url.searchParams.get("videoId") ?? undefined;
    }
    return /\/video\/(?:[^/]+\/)*?(\d+)/.exec(url.pathname)?.[1];
  }
}
