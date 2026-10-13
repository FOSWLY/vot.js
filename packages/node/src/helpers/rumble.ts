import { BaseHelper } from "./base";

export default class RumbleHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}
