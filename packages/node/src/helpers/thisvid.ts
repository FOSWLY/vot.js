import { BaseHelper } from "./base";

export default class ThisVidHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /(videos|embed)\/[^/]+/.exec(url.pathname)?.[0];
  }
}
