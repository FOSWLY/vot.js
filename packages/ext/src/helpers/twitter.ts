import { BaseHelper } from "./base";

export default class TwitterHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const videoId = /status\/([^/]+)/.exec(url.pathname)?.[1];
    if (videoId) {
      return videoId;
    }

    const postEl = this.video?.closest('[data-testid="tweet"]');
    const newLink = (
      postEl?.querySelector('a[role="link"][aria-label]') as
        | HTMLLinkElement
        | undefined
    )?.href;
    return newLink ? /status\/([^/]+)/.exec(newLink)?.[1] : undefined;
  }
}
