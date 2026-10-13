import { BaseHelper, VideoHelperError } from "./base";
export default class WSJHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?(?:wsj|barrons)\.com$/.test(url.hostname))
      return undefined;
    return /\/video\/(?:[^/]+\/)+([a-fA-F0-9-]{36})/.exec(url.pathname)?.[1];
  }
}
