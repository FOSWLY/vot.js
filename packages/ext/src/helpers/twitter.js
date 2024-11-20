import { BaseHelper } from "./base";
export default class TwitterHelper extends BaseHelper {
  async getVideoId(url) {
    return /status\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
