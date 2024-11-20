import { BaseHelper } from "./base";
export default class NewgroundsHelper extends BaseHelper {
  async getVideoId(url) {
    return /([^/]+)\/(view)\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
