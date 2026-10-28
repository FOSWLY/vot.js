import { BaseHelper } from "./base";

export default class CraftsyHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
