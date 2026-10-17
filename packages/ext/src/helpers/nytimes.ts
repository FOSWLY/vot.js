import { BaseHelper } from "./base";

export default class NYTimesHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
