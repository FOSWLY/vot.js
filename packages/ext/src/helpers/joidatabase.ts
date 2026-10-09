import PlyrHelper from "../players/plyr";
import { getFiniteDuration } from "../players/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class JOIDatabaseHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData = this.returnBaseData(videoId);
    const player = new PlyrHelper().getPlayer();
    if (!baseData || !player) {
      return baseData;
    }

    return {
      ...baseData,
      duration: getFiniteDuration(player.duration),
      title: player.config?.title,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:watch|embed)\/([0-9a-f]+)\/?$/.exec(url.pathname)?.[1];
  }
}
