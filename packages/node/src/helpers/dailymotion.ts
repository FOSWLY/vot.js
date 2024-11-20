import { BaseHelper } from "./base";

export default class DailymotionHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.hostname === "dai.ly"
      ? url.pathname.slice(1)
      : /video\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
