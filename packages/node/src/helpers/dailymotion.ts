import { BaseHelper } from "./base";

export default class DailymotionHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const videoIdFromQuery = url.searchParams.get("video");
    if (videoIdFromQuery) {
      return videoIdFromQuery;
    }

    if (url.hostname === "dai.ly") {
      return url.pathname.slice(1);
    }

    return /video\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
