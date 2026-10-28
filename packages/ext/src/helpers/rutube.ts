import { BaseHelper } from "./base";

export default class RutubeHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /(?:video|embed)\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
