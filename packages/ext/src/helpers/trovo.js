import { BaseHelper } from "./base";
export default class TrovoHelper extends BaseHelper {
  async getVideoId(url) {
    const vid = url.searchParams.get("vid");
    const path = /([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
    if (!vid || !path) {
      return undefined;
    }
    return `${path}?vid=${vid}`;
  }
}
