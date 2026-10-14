import { BaseHelper } from "./base";

export default class JWPlatformHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
