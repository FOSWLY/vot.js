import { BaseHelper } from "./base";

import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class IgnHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string) {
    const url = document.querySelector<HTMLSourceElement>(
      '.icms.video > source[type="video/mp4"][data-quality="360"]',
    )?.src;
    if (!url) {
      // try with default link
      return this.returnBaseData(videoId);
    }

    return {
      url: proxyMedia(url),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /([^/]+)\/([\d]+)\/video\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
