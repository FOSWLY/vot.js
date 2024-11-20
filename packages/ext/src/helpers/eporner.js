import { BaseHelper } from "./base";
export default class EpornerHelper extends BaseHelper {
  async getVideoId(url) {
    return /video-([^/]+)\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
