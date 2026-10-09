import { BaseHelper } from "./base";

export default class NicoNicoHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    if (url.hostname === "nico.ms") {
      return url.pathname.replace(/^\//, "").split("/")[0] || undefined;
    }

    return /\/watch\/([^/?#]+)/.exec(url.pathname)?.[1];
  }
}
