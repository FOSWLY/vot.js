import Logger from "@vot.js/shared/utils/logger";

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import PlyrHelper from "../players/plyr";

export default class JOIDatabaseHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    try {
      const plyr = new PlyrHelper();
      const player = plyr.getPlayer();
      if (!player) {
        return baseData;
      }

      const {
        duration,
        config: { title },
      } = player;
      return {
        ...baseData,
        duration:
          !Number.isNaN(duration) && duration > 0 ? duration : undefined,
        title,
      };
    } catch {
      Logger.error(
        `Failed to extract video data. Using base data for videoId: ${videoId}`,
      );
      return baseData;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:watch|embed)\/([0-9a-f]+)\/?$/.exec(url.pathname)?.[1];
  }
}
