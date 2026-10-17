import { BaseHelper } from "./base";

export default class VidliiHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
