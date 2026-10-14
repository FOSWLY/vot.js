import { BaseHelper } from "./base";

export default class MedalTvHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
