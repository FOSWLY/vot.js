import { BaseHelper } from "./base";

export default class BitchuteHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /(video|embed)\/([^/]+)/.exec(url.pathname)?.[2];
  }
}
