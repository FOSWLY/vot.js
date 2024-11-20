import { BaseHelper } from "./base";

export default class PornhubHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return (
      url.searchParams.get("viewkey") ??
      /embed\/([^/]+)/.exec(url.pathname)?.[1]
    );
  }
}
