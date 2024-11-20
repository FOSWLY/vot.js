import { BaseHelper } from "./base";
export default class BitchuteHelper extends BaseHelper {
  async getVideoId(url) {
    return /(video|embed)\/([^/]+)/.exec(url.pathname)?.[2];
  }
}
