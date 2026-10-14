import { BaseHelper } from "./base";

export default class BrightcoveHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
