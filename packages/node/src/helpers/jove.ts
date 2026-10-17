import { BaseHelper } from "./base";

export default class JoveHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const groups =
      /^\/(?:[a-z]{2}\/)?v\/(?<id>\d+)\/(?<slug>[^/?#]+)\/?$/i.exec(
        url.pathname,
      )?.groups;
    if (!groups) {
      return undefined;
    }

    const { id, slug } = groups;
    return `v/${id}/${slug}`;
  }
}
