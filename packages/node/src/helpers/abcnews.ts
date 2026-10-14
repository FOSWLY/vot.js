import { BaseHelper } from "./base";

export default class AbcNewsHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
