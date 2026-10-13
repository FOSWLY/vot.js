import { BaseHelper } from "./base";

export default class XHamsterHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(videos\/[^/]+-[\dA-Za-z]+)\/?$/.exec(url.pathname)?.[1];
  }
}
