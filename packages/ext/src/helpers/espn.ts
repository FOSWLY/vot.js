import { NativeDeltaHelper } from "./nativeDelta";
export default class ESPNHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^(?:www\.)?espn\.com$|^(?:[a-z0-9-]+\.)*espn\.go\.com$/.test(
        url.hostname,
      )
    )
      return undefined;
    const pathId =
      /^\/video\/(?:clip|iframe\/twitter)\/_\/id\/(\d+)(?:\/[^/]+)?\/?$/.exec(
        url.pathname,
      )?.[1] ??
      /^\/[^/]+\/video\/(\d+)(?:\/[^/]+)?\/?$/.exec(url.pathname)?.[1];
    if (pathId) return pathId;
    if (!/^\/video\/(?:clip|iframe\/twitter)\/?$/.test(url.pathname))
      return undefined;
    const id = url.searchParams.get("id");
    return id && /^\d+$/.test(id) ? id : undefined;
  }
}
