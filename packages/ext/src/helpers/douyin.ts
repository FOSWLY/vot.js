import { BaseHelper } from "./base";

import * as Douyin from "../types/helpers/douyin";

import { proxyMedia } from "@vot.js/shared/utils/utils";
import { RequestLang } from "@vot.js/shared/types/data";
import { availableLangs } from "@vot.js/shared/consts";

export default class DouyinHelper extends BaseHelper {
  getPlayer() {
    // @ts-expect-error var from page scripts
    if (typeof player === "undefined") {
      return undefined;
    }

    // @ts-expect-error var from page scripts
    return player as Douyin.Player;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string) {
    const xgPlayer = this.getPlayer();
    if (!xgPlayer) {
      return undefined;
    }

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
    const pathId = /video\/([\d]+)/.exec(url.pathname)?.[0];
    if (pathId) {
      return pathId;
    }

    const xgPlayer = this.getPlayer();
    if (!xgPlayer) {
      return undefined;
    }

    return xgPlayer.config.vid;
  }
}
