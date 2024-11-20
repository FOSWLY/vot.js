import { BaseHelper } from "./base";
export default class EggheadHelper extends BaseHelper {
  async getVideoId(url) {
    return url.pathname.slice(1);
  }
}
