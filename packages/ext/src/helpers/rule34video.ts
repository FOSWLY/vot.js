import { BaseHelper } from "./base";

export default class Rule34VideoHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const parts = /\/videos?\/(\d+)(?:\/(.+))?\/?$/.exec(url.pathname);
    if (!parts) {
      return undefined;
    }

    const [, id, tail] = parts;
    return tail ? `${id}/${tail.replace(/\/+$/, "")}/` : id;
  }
}
