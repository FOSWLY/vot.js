import { BaseHelper } from "./base";
export default class PeertubeHelper extends BaseHelper {
  async getVideoId(url) {
    return /\/w\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
