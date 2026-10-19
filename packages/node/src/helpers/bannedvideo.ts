import { BaseHelper } from "./base";

export default class BannedVideoHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/(?:embed\/|v\/)([a-zA-Z0-9]+)/.exec(url.pathname)?.[1];
  }
}
