import { BaseHelper } from "./base";

export default class NewgroundsHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /([^/]+)\/(view)\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
