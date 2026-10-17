import { BaseHelper } from "./base";

export default class CBSNewsHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
