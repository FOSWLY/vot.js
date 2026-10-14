import { BaseHelper } from "./base";

export default class MedalTvHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !/^(?:www\.)?medal\.tv$/.test(url.hostname)
    )
      return undefined;
    const m = /^\/games\/(?<game>[^/?#&]+)\/clips\/(?<id>[^/?#&]+)/.exec(
      url.pathname,
    );
    return m?.groups?.id
      ? `games/${m.groups.game}/clips/${m.groups.id}`
      : undefined;
  }
}
