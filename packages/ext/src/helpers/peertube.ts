import { BaseHelper } from "./base";

export default class PeertubeHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const normalizedPathname = url.pathname.replace(/\/+$/, "");

    const watchVideoId = /\/videos\/watch\/([^/]+)/.exec(
      normalizedPathname,
    )?.[1];
    if (watchVideoId) {
      return `/videos/watch/${watchVideoId}`;
    }

    const shortVideoId = /\/w\/([^/]+)/.exec(normalizedPathname)?.[1];
    if (shortVideoId) {
      return `/videos/watch/${shortVideoId}`;
    }

    return undefined;
  }
}
