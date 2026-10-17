import { BaseHelper } from "./base";

export default class XHamsterHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/(videos\/[^/]+-[\dA-Za-z]+)\/?$/.exec(url.pathname)?.[1];
  }
}
