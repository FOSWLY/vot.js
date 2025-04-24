import { BaseHelper } from "./base";

export default class TelegramHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    // only public channels
    return /([^/]+)\/(\d+)/.exec(url.pathname)?.[0];
  }
}
