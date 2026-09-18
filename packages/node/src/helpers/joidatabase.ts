import { BaseHelper } from "./base";

export default class JOIDatabaseHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:watch|embed)\/([0-9a-f]+)\/?$/.exec(url.pathname)?.[1];
  }
}
