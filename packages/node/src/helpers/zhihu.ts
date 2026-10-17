import { BaseHelper } from "./base";

export default class ZhihuHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
