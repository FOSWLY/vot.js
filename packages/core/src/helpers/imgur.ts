import { BaseHelper } from "./base";

export default class ImgurHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (/^\/(?:a|gallery|t|topic|r)\//.test(url.pathname)) return undefined;
    return /\/(?:[^/]+-)?([a-zA-Z0-9]+)(?:\.\w+)?\/?$/.exec(url.pathname)?.[1];
  }
}
