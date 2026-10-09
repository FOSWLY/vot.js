import { BaseHelper } from "./base";

export default class CBSNewsHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:news|video)\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}
