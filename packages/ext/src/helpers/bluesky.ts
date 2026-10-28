import { BaseHelper } from "./base";

export default class BlueskyHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
