import { BaseHelper } from "./base";

export default class PinterestHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.href;
  }
}
