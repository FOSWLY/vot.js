import { NativeDeltaHelper } from "./nativeDelta";
export default class JWPlatformHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:content\.jwplatform|cdn\.jwplayer)\.com$/.test(url.hostname))
      return undefined;
    return /^\/players\/([A-Za-z0-9]{8})(?:-[A-Za-z0-9]{8})?\.html$/.exec(
      url.pathname,
    )?.[1];
  }
}
