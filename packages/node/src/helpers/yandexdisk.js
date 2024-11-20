import { BaseHelper } from "./base";
export default class YandexDiskHelper extends BaseHelper {
  async getVideoId(url) {
    return /\/i\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
