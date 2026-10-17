import { BaseHelper } from "./base";

export default class LoomHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /(embed|share)\/([^/]+)?/.exec(url.pathname)?.[2];
  }
}
