import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type * as Sap from "@vot.js/shared/types/helpers/sap";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

// Public Kaltura player config of learning.sap.com (NEXT_PUBLIC_KALTURA_PARTNER_ID).
const SAP_KALTURA_DOMAIN = "cdnapisec.kaltura.com";
const SAP_KALTURA_PARTNER_ID = "1921661";

export default class SapHelper extends BaseHelper {
  API_ORIGIN = "https://learning.sap.com/";

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
      Logger.error("Failed to request kaltura data", (err as Error).message);
      return undefined;
    }
  }

  /**
   * Resolve the Kaltura entry for a page. learning.sap.com no longer ships
   * `embeddedVideos` in `__NEXT_DATA__`; the entry id now lives in the lesson
   * HTML (`<div id="1_xxxxxxxx" class="kalturaVideoLessonContainer">`) or in the
   * course `preview.sourceId`, while partner id/domain come from the public
   * player config (`NEXT_PUBLIC_KALTURA_PARTNER_ID`). No DOM execution needed.
   */
  // oxlint-disable-next-line no-explicit-any
  findKalturaEntry(nextData: any) {
    const video = nextData?.props?.pageProps?.embeddedVideos?.[0];
    const legacy = /https:\/\/([^/]+)\/p\/(\d+)\//i.exec(
      video?.contentUrl ?? "",
    );
    if (legacy && video?.videoId) {
      return {
        kalturaDomain: legacy[1],
        partnerId: legacy[2],
        entryId: String(video.videoId),
      };
    }

    const raw = JSON.stringify(nextData?.props?.pageProps ?? {});
    const entryId =
      /id=\\?"(\d_[0-9a-z]{8})\\?"[^>]*kalturaVideo/i.exec(raw)?.[1] ??
      /"preview":\{"format":"VIDEO","sourceId":"(\d_[0-9a-z]{8})"/i.exec(
        raw,
      )?.[1];
    if (!entryId) {
      return undefined;
    }

    return {
      kalturaDomain: SAP_KALTURA_DOMAIN,
      partnerId: SAP_KALTURA_PARTNER_ID,
      entryId,
    };
  }

  async getKalturaData(videoId: string) {
    const url = `${this.API_ORIGIN}${videoId}`;
    try {
      const res = await this.fetch(url);
      const content = await res.text();
      const nextDataMatch =
        /<script[^>]*id="__NEXT_DATA__"[^>]*>({.*?})<\/script>/is.exec(content);

      if (!nextDataMatch) {
        throw new VideoHelperError(
          `Failed to find __NEXT_DATA__ for ${videoId}`,
        );
      }

      const nextData = JSON.parse(nextDataMatch[1]);
      const entry = this.findKalturaEntry(nextData);
      if (!entry) {
        throw new VideoHelperError(
          `Failed to find Kaltura entry in __NEXT_DATA__ for ${videoId}`,
        );
      }

      const { kalturaDomain, partnerId, entryId } = entry;

      return await this.requestKaltura(kalturaDomain, partnerId, entryId);
    } catch (err: unknown) {
      Logger.error("Failed to get kaltura data", (err as Error).message);
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

    const subtitles =
      playbackContext.playbackCaptions?.map((caption) => {
        return {
          language: normalizeLang(caption.languageCode),
          source: "sap",
          format: "vtt",
          url: caption.webVttUrl,
          isAutoGenerated: caption.label.includes("auto-generated"),
        } as VideoDataSubtitle;
      }) ?? [];

    return {
      url: videoUrl,
      subtitles,
      duration,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /((courses|learning-journeys)\/([^/]+)(\/[^/]+)?)/.exec(
      url.pathname,
    )?.[1];
  }
}
