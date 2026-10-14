import { BaseHelper } from "./base";
export default class CBSNewsHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?cbsnews\.com$/.test(url.hostname)) return undefined;
    return /\/(?:news|video)\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}
