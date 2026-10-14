import { BaseHelper } from "./base";

export default class CHZZKHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
