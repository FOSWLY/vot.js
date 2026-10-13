import { BaseHelper, VideoHelperError } from "./base";
export default class SnapchatSpotlightHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?snapchat\.com$/.test(url.hostname)) return undefined;
    return /\/spotlight\/(\w+)/.exec(url.pathname)?.[1];
  }
}
