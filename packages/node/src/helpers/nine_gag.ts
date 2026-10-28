import { BaseHelper } from "./base";

export default class NineGAGHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /gag\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
