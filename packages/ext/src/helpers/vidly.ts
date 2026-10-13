import { NativeDeltaHelper } from "./nativeDelta";
export default class VidlyHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:s\.)?vid\.ly$/.test(url.hostname)) return undefined;
    return /^\/embeded\.html$/.test(url.pathname)
      ? url.searchParams.get("link") || undefined
      : /^\/(\w+)(?:\/|$)/.exec(url.pathname)?.[1];
  }
}
