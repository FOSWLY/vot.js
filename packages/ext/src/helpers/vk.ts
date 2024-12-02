import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";
import * as VK from "../types/helpers/vk";

import Logger from "@vot.js/shared/utils/logger";
import { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";

export default class VKHelper extends BaseHelper {
  static getPlayer() {
    // @ts-expect-error var from page scripts
    const videoView = Videoview as VK.Videoview;
    if (!videoView) {
      return undefined;
    }

    return videoView.getPlayerObject
      ? videoView.getPlayerObject.call(undefined)
      : undefined;
  }

  getDefault(videoId: string) {
    if (!this.service) {
      return undefined;
    }

    return {
      url: this.service.url + videoId,
      duration: undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const player = VKHelper.getPlayer();
    if (!player) {
      return this.getDefault(videoId);
    }

    try {
      const {
        description: descriptionHTML,
        duration,
        md_title: title,
      } = player.vars;

      const parser = new DOMParser();
      const doc = parser.parseFromString(descriptionHTML, "text/html");
      const description = Array.from(doc.body.childNodes)
        .filter((el) => el.nodeName !== "BR")
        .map((el) => el.textContent)
        .join("\n");

      let subtitles: VideoDataSubtitle[] | undefined;
      if (Object.hasOwn(player.vars, "subs")) {
        subtitles = (player.vars as VK.PlayerVarsWithSubs).subs.map((sub) => ({
          language: normalizeLang(sub.lang),
          source: "vk",
          format: "vtt",
          url: sub.url,
          isAutoGenerated: !!sub.is_auto,
        }));
      }

      return {
        url: this.service!.url + videoId,
        title,
        description,
        duration,
        subtitles,
      };
    } catch (err) {
      Logger.error(
        `Failed to get VK video data, because: ${(err as Error).message}`,
      );
      return this.getDefault(videoId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const pathID = /^\/(video|clip)-?\d{8,9}_\d{9}$/.exec(url.pathname);
    if (pathID) {
      return pathID[0].slice(1);
    }

    const idInsidePlaylist = /\/playlist\/[^/]+\/(video-\d{8,9}_\d{9})/.exec(
      url.pathname,
    );
    if (idInsidePlaylist) {
      return idInsidePlaylist[1];
    }

    const paramZ = url.searchParams.get("z");
    if (paramZ) {
      return paramZ.split("/")[0];
    }

    const paramOID = url.searchParams.get("oid");
    const paramID = url.searchParams.get("id");
    if (paramOID && paramID) {
      return `video-${Math.abs(parseInt(paramOID))}_${paramID}`;
    }

    return undefined;
  }
}
