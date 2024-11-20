import { BaseHelper } from "./base";
export default class XVideosHelper extends BaseHelper {
  async getVideoId(url) {
    return /[^/]+\/[^/]+$/.exec(url.pathname)?.[0];
  }
}
