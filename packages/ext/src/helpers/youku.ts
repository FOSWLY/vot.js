import { BaseHelper } from "./base";

export default class YoukuHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /v_show\/id_[\w=]+/.exec(url.pathname)?.[0];
  }
}
