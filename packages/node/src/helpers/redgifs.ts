import { BaseHelper } from "./base";

export default class RedgifsHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return undefined;
    const match =
      url.hostname === "thumbs2.redgifs.com"
        ? /^\/(?<id>[^-/?#.]+)(?=$|[-/?#.])/.exec(url.pathname)
        : /^(?:www\.)?redgifs\.com$/.test(url.hostname)
          ? /^\/(?:watch|ifr)\/(?<id>[^-/?#.]+)(?=$|[-/?#.])/.exec(url.pathname)
          : undefined;
    return match?.groups?.id?.toLowerCase();
  }
}
