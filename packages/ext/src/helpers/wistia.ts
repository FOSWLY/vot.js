import { BaseHelper } from "./base";

export default class WistiaHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/embed\/iframe\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
