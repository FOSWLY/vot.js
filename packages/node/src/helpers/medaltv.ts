import { BaseHelper, VideoHelperError } from "./base";
const medaltvUrlPattern =
  /^https?:\/\/(?:www\.)?medal\.tv\/games\/(?<game>[^/?#&]+)\/clips\/(?<id>[^/?#&]+)/;
export function parseMedalTvVideoId(url: string): string | undefined {
  const m = medaltvUrlPattern.exec(url);
  return m?.groups?.id
    ? `games/${m.groups.game}/clips/${m.groups.id}`
    : undefined;
}
export default class MedalTvHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseMedalTvVideoId(url.href);
  }
}
