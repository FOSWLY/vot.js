import { BaseHelper } from "./base";

export default class SnapchatSpotlightHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
