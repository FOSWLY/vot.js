import { BaseHelper } from "./base";

export default class ArchiveHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /(details|embed)\/([^/]+)/.exec(url.pathname)?.[2];
  }
}
