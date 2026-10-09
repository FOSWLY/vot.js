import { BaseHelper } from "./base";

export default class IMDbHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /video\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
