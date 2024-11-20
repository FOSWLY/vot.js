import { BaseHelper, VideoHelperError } from "./base";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";
export default class PornTNHelper extends BaseHelper {
  async getVideoData(videoId) {
    try {
      const { rnd, video_url: source, video_title: title } = flashvars;
      if (!source || !rnd) {
        throw new VideoHelperError("Failed to find video source or rnd");
      }
      const getFileUrl = new URL(source);
      getFileUrl.searchParams.append("rnd", rnd);
      Logger.log("PornTN get_file link", getFileUrl.href);
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
        err.message,
      );
      return undefined;
    }
  }
  async getVideoId(url) {
    return /\/videos\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}
