import {
  fetchKinopoiskWidgetState,
  getKinopoiskVideoData,
  getKinopoiskVideoId,
} from "@vot.js/shared/utils/kinopoisk";

import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

export * from "@vot.js/shared/utils/kinopoisk";

export default class KinopoiskHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      return await getKinopoiskVideoData(
        (id) => fetchKinopoiskWidgetState(this.fetch, id),
        videoId,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw err instanceof VideoHelperError
        ? err
        : new VideoHelperError(message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return getKinopoiskVideoId(url);
  }
}
