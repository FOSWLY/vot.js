import { NativeDeltaHelper } from "./nativeDelta";
export default class ZhihuHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?zhihu\.com$/.test(url.hostname)) return undefined;
    return /\/zvideo\/(\d+)/.exec(url.pathname)?.[1];
  }
}
