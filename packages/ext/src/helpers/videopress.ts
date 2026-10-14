import { NativeDeltaHelper } from "./nativeDelta";

export default class VideoPressHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !/^video(?:\.word)?press\.com$/.test(url.hostname)
    )
      return undefined;
    return /^\/embed\/(?<id>[\da-zA-Z]{8})\/?$/.exec(url.pathname)?.groups?.id;
  }
}
