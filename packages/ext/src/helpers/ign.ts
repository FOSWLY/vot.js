import { BaseHelper } from "./base";

import Ign from "@vot.js/shared/types/helpers/ign";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import { VideoDataError } from "@vot.js/core/utils/videoData";

export default class IgnHelper extends BaseHelper {
  // https://de.ign.com/m3gan-20/146217/video/m3gan-20-offizieller-trailer
  getVideoDataBySource(videoId: string) {
    const url = document.querySelector<HTMLSourceElement>(
      '.icms.video > source[type="video/mp4"][data-quality="360"]',
    )?.src;
    if (!url) {
      // try with default link
      return this.returnBaseData(videoId);
    }

    return {
      url: proxyMedia(url),
    };
  }

  getVideoDataByNext(videoId: string) {
    try {
      const nextContent = document.getElementById("__NEXT_DATA__")?.textContent;
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
    } catch (err) {
      Logger.warn(
        `Failed to get ign video data by video ID: ${videoId}, because ${
          (err as Error).message
        }. Using clear link instead...`,
      );
      return this.returnBaseData(videoId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string) {
    if (document.getElementById("__NEXT_DATA__")) {
      return this.getVideoDataByNext(videoId);
    }

    return this.getVideoDataBySource(videoId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return (
      /([^/]+)\/([\d]+)\/video\/([^/]+)/.exec(url.pathname)?.[0] ??
      /\/videos\/([^/]+)/.exec(url.pathname)?.[0]
    );
  }
}
