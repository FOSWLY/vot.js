import { BaseHelper } from "./base";

export default class YandexDiskHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/i\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
