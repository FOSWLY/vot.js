import { BaseHelper } from "./base";

export default class TelegramHelper extends BaseHelper {
  async getVideoId(url: URL) {
    // only public channels
    return /([^/]+)\/(\d+)/.exec(url.pathname)?.[0];
  }
}
