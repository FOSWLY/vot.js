import { BaseHelper } from "./base";

export default class OKRuHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/video\/(\d+)/.exec(url.pathname)?.[1];
  }
}
