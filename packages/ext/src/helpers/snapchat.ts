import { NativeDeltaHelper } from "./nativeDelta";
export default class SnapchatSpotlightHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?snapchat\.com$/.test(url.hostname)) return undefined;
    return /\/spotlight\/(\w+)/.exec(url.pathname)?.[1];
  }
}
