import { NativeDeltaHelper } from "./nativeDelta";
export default class CBSNewsHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?cbsnews\.com$/.test(url.hostname)) return undefined;
    return /\/(?:news|video)\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}
