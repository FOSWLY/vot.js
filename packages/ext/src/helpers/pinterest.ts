import { BaseHelper } from "./base";

export default class PinterestHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
