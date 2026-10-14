import { BaseHelper } from "./base";

export default class DzenHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /video\/watch\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
