import { BaseHelper } from "./base";

export default class DailymotionHelper extends BaseHelper {
  getVideoIdFromUrl(url: URL): string | undefined {
    const videoIdFromQuery = url.searchParams.get("video");
    if (videoIdFromQuery) {
      return videoIdFromQuery;
    }
  }

  resolveVideoIdViaPostMessage(): Promise<string | undefined> {
    return new Promise((resolve) => {
      const origin = "https://www.dailymotion.com";
      const timeout = setTimeout(() => {
        window.removeEventListener("message", onMessage);
        resolve(undefined);
      }, 3000);

      const onMessage = (e: MessageEvent) => {
        if (e.origin !== origin) {
          return;
        }
        if (!(typeof e.data === "string" && e.data.startsWith("getVideoId:"))) {
          return;
        }

        clearTimeout(timeout);
        window.removeEventListener("message", onMessage);
        // oxlint-disable-next-line promise/no-multiple-resolved FALSE-POSITIVE
        resolve(e.data.replace("getVideoId:", ""));
      };

      window.addEventListener("message", onMessage);
      window.top?.postMessage("getVideoId:", origin);
    });
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    const videoIdFromUrl = this.getVideoIdFromUrl(url);
    if (videoIdFromUrl) {
      return videoIdFromUrl;
    }

    if (window.self !== window.top) {
      return await this.resolveVideoIdViaPostMessage();
    }

    return url.hostname === "dai.ly"
      ? url.pathname.slice(1)
      : /video\/([^/]+)/.exec(url.pathname)?.[1];
  }
}
