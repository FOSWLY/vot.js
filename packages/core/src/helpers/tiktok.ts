import { BaseHelper } from "./base";

export default class TikTokHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /([^/]+)\/video\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
