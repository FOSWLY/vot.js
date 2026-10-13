import { NativeDeltaHelper } from "./nativeDelta";
export default class CraftsyHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:www\.)?craftsy\.com$/.test(url.hostname)) return undefined;
    return /\/class\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}
