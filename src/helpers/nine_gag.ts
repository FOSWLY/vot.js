import { BaseHelper } from "./base";

export default class NineGAGHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /gag\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
