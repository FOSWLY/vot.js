import { parseFromString } from "dom-parser";

import { BaseHelper, VideoHelperError } from "./base";

import { proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class IgnHelper extends BaseHelper {
  async getVideoData(videoId: string) {
    // embed unsupported
    try {
      const res = await this.fetch(this.service!.url + videoId);
      const content = await res.text();
      const doc = parseFromString(content.replace(/<!DOCTYPE html>/i, ""));
      const scriptEls = doc.getElementsByTagName("scripts");
      if (!scriptEls.length) {
        throw new VideoHelperError("Failed to find script elements");
      }

      const scriptData = Array.from(scriptEls).find(
        (script) =>
          script.getAttribute("type") === "application/ld+json" &&
          script.textContent.includes("contentUrl"),
      )?.textContent;
      if (!scriptData) {
        throw new VideoHelperError("Failed to find scriptData");
      }

      const { contentUrl, name, description } = JSON.parse(scriptData) as {
        contentUrl: string;
        name: string;
        description: string;
      };

      return {
        url: proxyMedia(contentUrl),
        title: name,
        description,
      };
    } catch (err) {
      Logger.error(
        `Failed to get Ign video data by video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /([^/]+)\/([\d]+)\/video\/([^/]+)/.exec(url.pathname)?.[0];
  }
}
