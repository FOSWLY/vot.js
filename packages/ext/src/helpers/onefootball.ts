import { NativeDeltaHelper } from "./nativeDelta";
export default class OneFootballHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:www\.)?onefootball\.com$/.test(url.hostname)) return undefined;
    return /^\/[a-z]{2}\/video\/[^/]+-(\d+)\/?$/.exec(url.pathname)?.[1];
  }
}
