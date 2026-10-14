import { BaseHelper } from "./base";

export default class StreamableHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
