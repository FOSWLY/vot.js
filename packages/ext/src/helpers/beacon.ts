import { NativeDeltaHelper } from "./nativeDelta";
export default class BeaconHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:www\.)?beacon\.tv$/.test(url.hostname)) return undefined;
    return /\/content\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}
