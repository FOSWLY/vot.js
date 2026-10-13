import { BaseHelper } from "./base";

export default class PeertubeHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/w\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
