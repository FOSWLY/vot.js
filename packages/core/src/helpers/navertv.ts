import { BaseHelper } from "./base";

export default class NaverTVHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.searchParams.get("seedMediaId") ?? undefined;
  }
}
