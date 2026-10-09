import { BaseHelper } from "./base";

export default class SnapchatSpotlightHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/spotlight\/(\w+)/.exec(url.pathname)?.[1];
  }
}
