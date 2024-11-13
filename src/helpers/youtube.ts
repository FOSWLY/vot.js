import { BaseHelper } from "./base";

export default class YoutubeHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    if (url.hostname === "youtu.be") {
      url.search = `?v=${url.pathname.replace("/", "")}`;
      url.pathname = "/watch";
    }

    return (/(?:watch|embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1] ??
      url.searchParams.get("v")) as string | undefined;
  }
}
