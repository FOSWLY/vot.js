import { BaseHelper } from "./base";

export default class SpiegelHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
