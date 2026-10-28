import { BaseHelper } from "./base";

export default class BfmTvHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
