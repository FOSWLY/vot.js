import { NativeDeltaHelper } from "./nativeDelta";
export default class PinterestHelper extends NativeDeltaHelper {
  async getVideoId(url: URL) {
    if (
      !/^(?:www\.)?pinterest\.(?:com|co\.uk|de|fr|es|it|ca|com\.au)$/.test(
        url.hostname,
      )
    )
      return undefined;
    return /\/pin\/(?:[\w-]+--)?(\d+)/.exec(url.pathname)?.[1];
  }
}
