import { NativeDeltaHelper } from "./nativeDelta";

export default class HuyaHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !/^(?:www\.)?huya\.com$/.test(url.hostname)
    )
      return undefined;
    return /^\/video\/play\/(?<id>\d+)\.html(?=$|[/?#])/.exec(url.pathname)
      ?.groups?.id;
  }
}
