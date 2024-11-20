import { BaseHelper } from "./base";

export default class DzenHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /video\/watch\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
