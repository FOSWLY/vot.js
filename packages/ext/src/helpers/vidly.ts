import { BaseHelper } from "./base";

export default class VidlyHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
