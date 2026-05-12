import Logger from "@vot.js/shared/utils/logger";
import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";

export default class DataCampHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "datacamp";

  getVideoDataFromInput(): {
    video_url?: string;
    plain_video_mp4_link?: string;
    plain_video_hls_link?: string;
    video_mp4_link?: string;
    video_hls_link?: string;
    subtitle_vtt_link?: string;
    audio_language_variants?: Record<
      string,
      { subtitle_vtt_link?: string } | undefined
    >;
  } | null {
    try {
      const input =
        document.querySelector("#slideDeckData") ||
        document.getElementById("videoData");
      if (
        !input ||
        (!(input instanceof HTMLInputElement) &&
          !(input instanceof HTMLTextAreaElement)) ||
        !input.value
      ) {
        return null;
      }

      return JSON.parse(input.value) as ReturnType<
        DataCampHelper["getVideoDataFromInput"]
      >;
    } catch (err) {
      Logger.error(
        "Failed to parse DataCamp videoData input",
        err instanceof Error ? err.message : String(err),
      );
      return null;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return undefined;
    }

    const meta = this.getVideoDataFromInput();
    // if (!data.subtitles?.length && meta) {
    //   const subtitles: VideoDataSubtitle[] = [];

    //   if (meta.subtitle_vtt_link) {
    //     subtitles.push({
    //       url: meta.subtitle_vtt_link,
    //       language: normalizeLang("en"),
    //       source: this.SUBTITLE_SOURCE,
    //       format: this.SUBTITLE_FORMAT,
    //     });
    //   }

    //   if (meta.audio_language_variants) {
    //     for (const [langCode, variant] of Object.entries(
    //       meta.audio_language_variants,
    //     )) {
    //       if (!variant?.subtitle_vtt_link) {
    //         continue;
    //       }

    //       subtitles.push({
    //         url: variant.subtitle_vtt_link,
    //         language: normalizeLang(langCode.split("-")[0]),
    //         source: this.SUBTITLE_SOURCE,
    //         format: this.SUBTITLE_FORMAT,
    //       });
    //     }
    //   }

    //   data.subtitles = subtitles;
    // }

    const videoUrl =
      meta?.video_url ??
      meta?.plain_video_mp4_link ??
      meta?.plain_video_hls_link ??
      meta?.video_mp4_link ??
      meta?.video_hls_link;

    if (!videoUrl) {
      return undefined;
    }

    const VideoData: MinimalVideoData & {
      video_url: string;
    } = {
      url: videoId,
      video_url: videoUrl,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: videoUrl,
        },
      ],
    };

    return VideoData;
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    return url.href;
  }
}
