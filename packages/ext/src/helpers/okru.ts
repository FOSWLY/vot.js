import { BaseHelper } from "./base";

export default class OKRuHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/video\/(\d+)/.exec(url.pathname)?.[1];
  }
}
