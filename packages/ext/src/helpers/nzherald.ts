import { BaseHelper } from "./base";

export default class NZHeraldHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
