import { BaseHelper } from "./base";

const weiboVideoIdRe = /^\d+:(?:[\da-f]{32}|\d{16,})$/i;
const weiboLayerIdRe = /^[A-Za-z0-9]+$/;
const weiboHostRe = /^(?:www\.)?weibo\.com$/;
const weiboLoginPathRe = /^\/newlogin\/?$/;

export default class WeiboHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    if (url.hostname === "video.weibo.com") {
      const fid = url.searchParams.get("fid");
      if (!fid || !weiboVideoIdRe.test(fid)) {
        return undefined;
      }

      return `tv/show/${fid}`;
    }

    if (weiboHostRe.test(url.host) && weiboLoginPathRe.test(url.pathname)) {
      const nestedUrl = url.searchParams.get("url");
      if (nestedUrl) {
        try {
          const parsedNestedUrl = new URL(nestedUrl, url.origin);
          if (parsedNestedUrl.href !== url.href) {
            const nestedVideoId: string | undefined =
              await this.getVideoId(parsedNestedUrl);
            if (nestedVideoId) {
              return nestedVideoId;
            }
          }
        } catch {
          // ignore invalid wrapped urls
        }
      }

      const layerId = url.searchParams.get("layerid");
      if (layerId && weiboLayerIdRe.test(layerId)) {
        return `0/${layerId}`;
      }
    }

    const normalizedPath = url.pathname.replace(/\/+$/, "");
    if (
      /^\/\d+\/[A-Za-z0-9]+$/.test(normalizedPath) ||
      /^\/0\/[A-Za-z0-9]+$/.test(normalizedPath) ||
      /^\/tv\/show\/\d+:(?:[\da-f]{32}|\d{16,})$/i.test(normalizedPath)
    ) {
      return normalizedPath.slice(1);
    }

    return undefined;
  }
}
