import { BaseHelper } from "./base";

export default class BeaconHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
