import { BaseHelper } from "./base";

export default class AcFunHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }
}
