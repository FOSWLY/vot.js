import { BaseHelper } from "./base";

export default class OneFootballHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
