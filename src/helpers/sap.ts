import { parseFromString } from "dom-parser";

import * as Sap from "../types/helpers/sap";
import { MinimalVideoData, VideoDataSubtitle } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";
import { normalizeLang } from "../utils/utils";

export default class SapHelper extends BaseHelper {
  API_ORIGIN = "https://learning.sap.com/courses";

  async requestKaltura(
    kalturaDomain: string,
    partnerId: string | number,
    entryId: string,
  ) {
    const clientTag = "html5:v3.17.22"; // kaltura-ovp-player
    const apiVersion = "3.3.0"; // playkit-kaltura-live
    try {
      const res = await this.fetch(
        `https://${kalturaDomain}/api_v3/service/multirequest`,
        {
          method: "POST",
          body: JSON.stringify({
            "1": {
              service: "session",
              action: "startWidgetSession",
              widgetId: `_${partnerId}`,
            },
            "2": {
              service: "baseEntry",
              action: "list",
              ks: "{1:result:ks}",
              filter: { redirectFromEntryId: entryId },
              responseProfile: {
                type: 1,
                fields:
                  "id,referenceId,name,description,dataUrl,duration,flavorParamsIds,type,dvrStatus,externalSourceType,createdAt,updatedAt,endDate,plays,views,downloadUrl,creatorId",
              },
            },
            "3": {
              service: "baseEntry",
              action: "getPlaybackContext",
              entryId: "{2:result:objects:0:id}",
              ks: "{1:result:ks}",
              contextDataParams: {
                objectType: "KalturaContextDataParams",
                flavorTags: "all",
              },
            },
            apiVersion,
            format: 1,
            ks: "",
            clientTag,
            partnerId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return (await res.json()) as Sap.Response;
    } catch (err: unknown) {
      console.error("Failed to get kaltura data", (err as Error).message);
      return undefined;
    }
  }

  async getKalturaData(videoId: string) {
    const url = `${this.API_ORIGIN}/${videoId}`;
    try {
      const res = await this.fetch(url);
      const content = await res.text();
      const sapData =
        /https:\/\/([^"]+)\/p\/([^"]+)\/embedPlaykitJs\/uiconf_id\/([^"]+)/.exec(
          content,
        );
      if (!sapData) {
        throw new VideoHelperError(
          `Failed to get sap data for videoId: ${videoId}`,
        );
      }

      const [, kalturaDomain, partnerId] = sapData;
      const doc = parseFromString(content.replace("<!DOCTYPE html>", ""));
      let entryId = doc
        .getElementById("shadow")
        ?.firstChild?.getAttribute("id");
      if (!entryId) {
        // for course demo
        entryId = /"sourceId":\s?"([^"]+)"/.exec(content)?.[1];
      }

      if (!kalturaDomain || Number.isNaN(+partnerId) || !entryId) {
        throw new VideoHelperError(
          `One of the necessary parameters for getting a link to a sap video in wasn't found for ${videoId}. Params: kalturaDomain = ${kalturaDomain}, partnerId = ${partnerId}, entryId = ${entryId}`,
        );
      }

      return await this.requestKaltura(kalturaDomain, partnerId, entryId);
    } catch (err: unknown) {
      console.error("Failed to get kaltura data", (err as Error).message);
      return undefined;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const kalturaData = await this.getKalturaData(videoId);
    if (!kalturaData) {
      return undefined;
    }

    const [, baseEntryList, playbackContext] = kalturaData;
    const { duration } = baseEntryList.objects[0];

    const videoUrl = playbackContext.sources.find(
      (source) =>
        source.format === "url" &&
        source.protocols === "http,https" &&
        source.url.includes(".mp4"),
    )?.url;
    if (!videoUrl) {
      return undefined;
    }

    const subtitles = playbackContext.playbackCaptions.map((caption) => {
      return {
        language: normalizeLang(caption.languageCode),
        format: "vtt",
        url: caption.webVttUrl,
      } as VideoDataSubtitle;
    });

    return {
      url: videoUrl,
      subtitles,
      duration,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /courses\/(([^/]+)(\/[^/]+)?)/.exec(url.pathname)?.[1];
  }
}
