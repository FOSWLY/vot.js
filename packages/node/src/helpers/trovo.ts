import { BaseHelper } from "./base";

export default class TrovoHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const vid = url.searchParams.get("vid");
    const path = /([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
    if (!vid || !path) {
      return undefined;
    }

    return `${path}?vid=${vid}`;
  }
}
