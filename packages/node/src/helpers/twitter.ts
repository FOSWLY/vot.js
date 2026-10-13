import { BaseHelper } from "./base";

export default class TwitterHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /status\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
