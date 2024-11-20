import { BaseHelper } from "./base";

export default class XVideosHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /[^/]+\/[^/]+$/.exec(url.pathname)?.[0];
  }
}
