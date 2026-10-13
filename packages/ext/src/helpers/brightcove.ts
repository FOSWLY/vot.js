import { NativeDeltaHelper } from "./nativeDelta";
export default class BrightcoveHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^players\.brightcove\.net$/.test(url.hostname)) return undefined;
    return url.searchParams.get("videoId") || undefined;
  }
}
