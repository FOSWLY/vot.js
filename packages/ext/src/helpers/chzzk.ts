import { NativeDeltaHelper } from "./nativeDelta";
export default class CHZZKHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^chzzk\.naver\.com$/.test(url.hostname)) return undefined;
    return /\/video\/(\d+)/.exec(url.pathname)?.[1];
  }
}
