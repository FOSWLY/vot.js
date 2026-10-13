import { NativeDeltaHelper } from "./nativeDelta";
export default class NZHeraldHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:www\.)?nzherald\.co\.nz$/.test(url.hostname)) return undefined;
    return /\/([A-Z0-9]+)\/?$/.exec(url.pathname)?.[1];
  }
}
