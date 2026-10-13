import { NativeDeltaHelper } from "./nativeDelta";
export default class WSJHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?(?:wsj|barrons)\.com$/.test(url.hostname))
      return undefined;
    return /\/video\/(?:[^/]+\/)+([a-fA-F0-9-]{36})/.exec(url.pathname)?.[1];
  }
}
