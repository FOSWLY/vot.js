import { availableLangs } from "@vot.js/shared/consts";
import type { RequestLang } from "@vot.js/shared/types/data";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import type * as Douyin from "../types/helpers/douyin";
import { BaseHelper } from "./base";

declare global {
  const player: Douyin.Player | undefined;
}

export default class DouyinHelper extends BaseHelper {
  static getPlayer() {
    if (typeof player === "undefined") {
      return undefined;
    }

    return player;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(_videoId: string) {
    const xgPlayer = DouyinHelper.getPlayer();
    if (!xgPlayer) {
      return undefined;
    }

    const {
      config: { url: sources, duration, lang, isLive: isStream },
    } = xgPlayer;
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
      url: proxyMedia(source.src, "mp4", this.mediaProxy),
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

    return DouyinHelper.getPlayer()?.config.vid;
  }
}
