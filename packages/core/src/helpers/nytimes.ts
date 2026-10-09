import { BaseHelper } from "./base";

export default class NYTimesHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (url.hostname === "graphics8.nytimes.com") {
      return url.searchParams.get("videoId") ?? undefined;
    }
    return /\/video\/(?:[^/]+\/)*?(\d+)/.exec(url.pathname)?.[1];
  }
}
