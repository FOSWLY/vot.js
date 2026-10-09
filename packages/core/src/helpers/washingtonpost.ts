import { BaseHelper } from "./base";

export default class WashingtonPostHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:video|posttv)\/(?:[^/]+\/)*([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/.exec(
      url.pathname,
    )?.[1];
  }
}
