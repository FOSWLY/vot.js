import { BaseHelper } from "./base";

export default class PeertubeHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/w\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
