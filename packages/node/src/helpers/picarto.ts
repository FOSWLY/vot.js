import { BaseHelper } from "./base";

export default class PicartoHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return (
      /\/((?:videopopout|[^/]+(?:\/profile)?\/videos)\/[^/?#&/]+)\/?$/.exec(
        url.pathname,
      )?.[1] ?? /^\/([^/#?]+)\/?$/.exec(url.pathname)?.[1]
    );
  }
}
