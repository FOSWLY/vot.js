import { BaseHelper } from "./base";

export default class RedgifsHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
