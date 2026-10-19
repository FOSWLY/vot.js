import { BaseHelper } from "./base";

export default class ArchiveHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return (
      /(?:details|embed)\/(.+)/.exec(url.pathname)?.[1]?.replace(/\/$/, "") ||
      undefined
    );
  }
}
