import { BaseHelper } from "./base";

export default class WSJHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
