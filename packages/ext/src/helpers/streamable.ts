import { NativeDeltaHelper } from "./nativeDelta";
export default class StreamableHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (!/^streamable\.com$/.test(url.hostname)) return undefined;
    return /^\/(?:[es]\/)?(\w+)\/?$/.exec(url.pathname)?.[1];
  }
}
