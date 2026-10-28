import { BaseHelper } from "./base";

export default class HuyaHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
