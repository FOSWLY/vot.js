import { NativeDeltaHelper } from "./nativeDelta";
export default class NOZHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?noz\.de$/.test(url.hostname)) return undefined;
    return /\/video\/(\d+)/.exec(url.pathname)?.[1];
  }
}
