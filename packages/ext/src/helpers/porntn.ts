import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";

import { proxyMedia } from "@vot.js/shared/utils/utils";
import * as PornTN from "@vot.js/shared/types/helpers/porntn";
import Logger from "@vot.js/shared/utils/logger";

export default class PornTNHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const {
        rnd,
        video_url: source,
        video_title: title,
      }: // @ts-expect-error var from page scripts
      PornTN.FlashVars = flashvars; // window.flashvars
      if (!source || !rnd) {
        throw new VideoHelperError("Failed to find video source or rnd");
      }

      const getFileUrl = new URL(source);
      getFileUrl.searchParams.append("rnd", rnd);
      Logger.log("PornTN get_file link", getFileUrl.href);
      // this is a necessary measure, because the get_file request requires the presence of a PHPSESSID cookie
      const cdnResponse = await this.fetch(getFileUrl.href, { method: "head" });
      const cdnUrl = new URL(cdnResponse.url);
      Logger.log("PornTN cdn link", cdnUrl.href);
      const proxiedUrl = proxyMedia(cdnUrl);
      return {
        url: proxiedUrl,
        title,
      };
    } catch (err) {
      Logger.error(
        `Failed to get PornTN data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/videos\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}
