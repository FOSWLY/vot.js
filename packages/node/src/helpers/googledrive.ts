import { BaseHelper } from "./base";

export default class GoogleDriveHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/file\/d\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
