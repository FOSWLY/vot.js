import { BaseHelper } from "./base";

export default class LoomHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /(embed|share)\/([^/]+)?/.exec(url.pathname)?.[2];
  }
}
