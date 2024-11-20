import { BaseHelper } from "./base";
export default class ArchiveHelper extends BaseHelper {
  async getVideoId(url) {
    return /(details|embed)\/([^/]+)/.exec(url.pathname)?.[2];
  }
}
