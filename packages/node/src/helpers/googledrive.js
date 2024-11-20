import { BaseHelper } from "./base";
export default class GoogleDriveHelper extends BaseHelper {
  async getVideoId(url) {
    return /\/file\/d\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
