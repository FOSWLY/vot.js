import { BaseHelper } from "./base";

export default class ZhihuHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/zvideo\/(\d+)/.exec(url.pathname)?.[1];
  }
}
