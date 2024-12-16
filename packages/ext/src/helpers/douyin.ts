import { BaseHelper } from "./base";

import * as Douyin from "../types/helpers/douyin";

import { proxyMedia } from "@vot.js/shared/utils/utils";
import { RequestLang } from "@vot.js/shared/types/data";
import { availableLangs } from "@vot.js/shared/consts";

export default class DouyinHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string) {
    // @ts-expect-error var from page scripts
    if (typeof player === "undefined") {
      return undefined;
    }

    // @ts-expect-error var from page scripts
    const xgPlayer = player as Douyin.Player; // window.player

    const { url: sources, duration, lang, isLive: isStream } = xgPlayer.config;
    if (!sources) {
      return undefined;
    }

    const source = sources.find((s) =>
      s.src.includes("www.douyin.com/aweme/v1/play/"),
    );
    if (!source) {
      return undefined;
    }

    return {
      url: proxyMedia(source.src),
      duration,
      isStream,
      ...(availableLangs.includes(lang as RequestLang)
        ? { detectedLanguage: lang as RequestLang }
        : {}),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /video\/([\d]+)/.exec(url.pathname)?.[0];
  }
}
