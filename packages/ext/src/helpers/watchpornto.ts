import { BaseHelper } from "./base";

export default class WatchPornToHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /(video|embed)\/(\d+)(\/[^/]+\/)?/.exec(url.pathname)?.[0];
  }
}
