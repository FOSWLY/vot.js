import { BaseHelper } from "./base";

export default class BilibiliHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const playId = /(?:bangumi|cheese)\/play\/[^/]+/.exec(url.pathname)?.[0];
    if (playId) {
      return playId;
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

    const vid = /video\/[^/]+/.exec(url.pathname)?.[0];
    if (vid) {
      const p = url.searchParams.get("p");
      return p !== null ? `${vid}/?p=${p}` : vid;
    }

    return undefined;
  }
}
