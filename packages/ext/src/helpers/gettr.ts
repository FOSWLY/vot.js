import { NativeDeltaHelper } from "./nativeDelta";

export default class GettrHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !/^(?:www\.)?gettr\.com$/.test(url.hostname)
    )
      return undefined;
    return /^\/post\/(?<id>[a-z0-9]+)\/?$/.exec(url.pathname)?.groups?.id;
  }
}
