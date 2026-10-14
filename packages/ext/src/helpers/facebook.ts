import { BaseHelper } from "./base";

export default class FacebookHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}
