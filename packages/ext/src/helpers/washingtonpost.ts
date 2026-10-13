import { NativeDeltaHelper } from "./nativeDelta";
export default class WashingtonPostHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?washingtonpost\.com$/.test(url.hostname)) return undefined;
    return /\/(?:video|posttv)\/(?:[^/]+\/)*([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/.exec(
      url.pathname,
    )?.[1];
  }
}
