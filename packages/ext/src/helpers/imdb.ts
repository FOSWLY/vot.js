import { BaseHelper } from "./base";

export default class IMDbHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /video\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
