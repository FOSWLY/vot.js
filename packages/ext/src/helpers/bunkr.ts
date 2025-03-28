import { BaseHelper } from "./base";

export default class BunkrHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string) {
    const url = document.querySelector<HTMLSourceElement>(
      '#player > source[type="video/mp4"]',
    )?.src;
    if (!url) {
      return undefined;
    }

    return {
      url,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/f\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
