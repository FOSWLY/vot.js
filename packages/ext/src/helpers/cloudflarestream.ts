import { BaseHelper } from "./base";

export default class CloudflareStreamHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.pathname + url.search;
  }
}
