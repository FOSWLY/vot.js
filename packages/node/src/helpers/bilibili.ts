import { BaseHelper } from "./base";

export default class BilibiliHelper extends BaseHelper {
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

    // bilibili.tv
    const intlId =
      /^\/(?:[a-z]{2}\/)?((?:play\/\d+(?:\/\d+)?|video\/\d+))\/?$/i.exec(
        url.pathname,
      )?.[1];
    if (intlId) {
      return intlId;
    }

    let vid = /video\/([^/]+)/.exec(url.pathname)?.[0];
    if (vid && url.searchParams.get("p") !== null) {
      vid += `/?p=${url.searchParams.get("p")}`;
    }
    return vid;
  }
}
