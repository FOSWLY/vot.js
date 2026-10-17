import { BaseHelper } from "./base";

export default class ThisVidHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /(videos|embed)\/[^/]+/.exec(url.pathname)?.[0];
  }
}
