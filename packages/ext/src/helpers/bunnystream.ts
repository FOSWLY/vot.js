import { BaseHelper } from "./base";

export default class BunnyStreamHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.pathname + url.search;
  }
}
