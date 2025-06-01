import { Dom, parseFromString } from "dom-parser";

import { BaseHelper, VideoHelperError } from "./base";

import { VideoDataError } from "@vot.js/core/utils/videoData";
import * as Ign from "@vot.js/shared/types/helpers/ign";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class IgnHelper extends BaseHelper {
  getVideoDataByScriptData(doc: Dom) {
    const scriptEls = doc.getElementsByTagName("script");
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

    const { contentUrl, name, description } = JSON.parse(
      scriptData,
    ) as Ign.ScriptData;

    return {
      url: proxyMedia(contentUrl),
      title: name,
      description,
    };
  }

  getVideoDataByNext(doc: Dom) {
    const nextContent = doc.getElementById("__NEXT_DATA__")?.textContent;
    if (!nextContent) {
      throw new VideoDataError("Not found __NEXT_DATA__ content");
    }

    const data = JSON.parse(nextContent) as Ign.NextData;
    const {
      props: {
        pageProps: {
          page: {
            description,
            title,
            video: {
              videoMetadata: { duration },
              assets,
            },
          },
        },
      },
    } = data;
    const videoUrl = assets.find(
      (asset) => asset.height === 360 && asset.url.includes(".mp4"),
    )?.url;
    if (!videoUrl) {
      throw new VideoDataError("Not found video URL in assets");
    }

    return {
      url: proxyMedia(videoUrl),
      duration,
      title,
      description,
    };
  }

  getVideoDataByIcms(doc: Dom) {
    const el = doc.getElementsByClassName("icmsvideocontainer")?.[0];
    const dataContent = el.getAttribute("data-json");
    const {
      title,
      mediaFiles: { "360": videoUrl },
      is_live: isStream,
    } = JSON.parse(dataContent.replaceAll("&quot;", '"')) as Ign.IcmsData;
    return {
      url: proxyMedia(videoUrl),
      title,
      isStream,
    };
  }

  async getVideoData(videoId: string) {
    try {
      const res = await this.fetch(this.service!.url + videoId);
      if (!res.ok) {
        throw new VideoHelperError(
          `Request failed with ${res.statusText} (${res.status})`,
        );
      }
      const content = await res.text();
      const doc = parseFromString(content.replace(/<!DOCTYPE html>/i, ""));
      if (doc.getElementById("__NEXT_DATA__")) {
        return this.getVideoDataByNext(doc);
      } else if (doc.getElementsByClassName("icmsvideocontainer").length) {
        return this.getVideoDataByIcms(doc);
      }

      return this.getVideoDataByScriptData(doc);
    } catch (err) {
      Logger.error(
        `Failed to get Ign video data by video ID: ${videoId}, because ${(err as Error).message}`,
      );
      return this.returnBaseData(videoId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return (
      /([^/]+)\/([\d]+)\/video\/([^/]+)/.exec(url.pathname)?.[0] ??
      /\/videos\/([^/]+)/.exec(url.pathname)?.[0]
    );
  }
}
