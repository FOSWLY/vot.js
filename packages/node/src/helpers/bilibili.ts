import { BaseHelper } from "./base";

export default class BilibiliHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const bangumiId = /bangumi\/play\/([^/]+)/.exec(url.pathname)?.[0];
    if (bangumiId) {
      return bangumiId;
    }

    // embed
    const bvid = url.searchParams.get("bvid");
    if (bvid) {
      return `video/${bvid}`;
    }

    let vid = /video\/([^/]+)/.exec(url.pathname)?.[0];
    if (vid && url.searchParams.get("p") !== null) {
      vid += `/?p=${url.searchParams.get("p")}`;
    }
    return vid;
  }
}
