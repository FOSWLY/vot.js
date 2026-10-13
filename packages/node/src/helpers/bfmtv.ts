import { BaseHelper, VideoHelperError } from "./base";
const bfmtvUrlPattern =
  /^https?:\/\/(?<host>(?:www\.|rmc\.)?bfmtv\.com)\/(?<path>(?:[^\/]+\/)*[^\/?&#]+_V[A-Z]-(?<id>\d{12})\.html)/;
export function parseBfmTvVideoId(url: string): string | undefined {
  const g = bfmtvUrlPattern.exec(url)?.groups;
  return g?.host && g.path && g.id ? `${g.host}/${g.path}` : undefined;
}
export default class BfmTvHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseBfmTvVideoId(url.href);
  }
}
