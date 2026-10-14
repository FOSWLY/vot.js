import { NativeDeltaHelper } from "./nativeDelta";

export default class BfmTvHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    const g =
      /^https?:\/\/(?<host>(?:www\.|rmc\.)?bfmtv\.com)\/(?<path>(?:[^/]+\/)*[^/?&#]+_V[A-Z]-(?<id>\d{12})\.html)/.exec(
        url.href,
      )?.groups;
    return g?.host && g.path && g.id ? `${g.host}/${g.path}` : undefined;
  }
}
