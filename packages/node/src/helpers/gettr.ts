import { BaseHelper } from "./base";

export default class GettrHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
