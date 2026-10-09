import { BaseHelper } from "./base";

export default class WSJHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/video\/(?:[^/]+\/)+([a-fA-F0-9-]{36})/.exec(url.pathname)?.[1];
  }
}
