import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { TranslationHelp } from "@vot.js/core/types/yandex";
import * as Vimeo from "@vot.js/shared/types/helpers/vimeo";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class VimeoHelper extends BaseHelper {
  API_KEY = "";
  DEFAULT_SITE_ORIGIN = "https://vimeo.com";
  SITE_ORIGIN = this.isPrivatePlayer()
    ? (this.service?.url?.slice(0, -1) ?? this.DEFAULT_SITE_ORIGIN)
    : this.DEFAULT_SITE_ORIGIN;

  isErrorData(data: Vimeo.Data): data is Vimeo.Error {
    return Object.hasOwn(data, "error");
  }

  isPrivatePlayer() {
    return this.referer && !this.referer.includes("vimeo.com");
  }

  async getViewerData() {
    try {
      const res = await this.fetch(`https://vimeo.com/_next/viewer`);
      const data = (await res.json()) as Vimeo.ViewerData;
      const { apiUrl, jwt } = data;
      this.API_ORIGIN = `https://${apiUrl}`;
      this.API_KEY = `jwt ${jwt}`;
      return data;
    } catch (err: unknown) {
      Logger.error(
        `Failed to get default viewer data.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoInfo(videoId: string) {
    try {
      const params = new URLSearchParams({
        fields: "name,link,description,duration",
      }).toString();
      const res = await this.fetch(
        `${this.API_ORIGIN}/videos/${videoId}?${params}`,
        {
          headers: {
            Authorization: this.API_KEY,
          },
        },
      );

      const data = (await res.json()) as Vimeo.Error | Vimeo.VideoInfo;
      if (this.isErrorData(data)) {
        throw new Error(data.developer_message ?? data.error);
      }

      return data;
    } catch (err: unknown) {
      Logger.error(
        `Failed to get video info by video ID: ${videoId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getPrivateVideoSource(files: Vimeo.PrivateFiles) {
    try {
      const { default_cdn, cdns } = files.dash;
      const cdnUrl = cdns[default_cdn].url;
      const res = await this.fetch(cdnUrl);
      if (res.status !== 200) {
        throw new VideoHelperError(await res.text());
      }

      const data = (await res.json()) as Vimeo.DashFileConfig;
      const baseUrl = new URL(cdnUrl);
      const pathLength =
        Array.from(data.base_url.matchAll(/\.\.\//g)).length + 1;
      const pathFragments = baseUrl.pathname.split("/");
      let extraPath = data.base_url.replaceAll("../", "");
      extraPath =
        extraPath && !extraPath.startsWith("/") ? `/${extraPath}` : extraPath;
      baseUrl.pathname =
        pathFragments.slice(0, pathFragments.length - pathLength).join("/") +
        extraPath;
      if (!baseUrl.pathname.endsWith("/")) {
        baseUrl.pathname += "/";
      }

      const videoData = data.audio.find(
        (v) => v.mime_type === "audio/mp4" && v.format === "dash",
      );
      if (!videoData) {
        throw new VideoHelperError("Failed to find video data");
      }

      const segmentUrl = videoData.segments?.[0]?.url;
      if (!segmentUrl) {
        throw new VideoHelperError("Failed to find first segment url");
      }

      const [videoName, videoParams] = segmentUrl.split("?", 2);
      const params = new URLSearchParams(videoParams);
      params.delete("range");
      baseUrl.pathname += `${videoData.base_url}${videoName}`; // base_url ends with "/"
      baseUrl.href = baseUrl.href.split("?")[0] + "?" + params.toString();
      return baseUrl.href;
    } catch (err: unknown) {
      Logger.error(
        `Failed to get private video source`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getPrivateVideoInfo(videoId: string) {
    try {
      const videoSource = await this.getPrivateVideoSource(
        // @ts-expect-error var from page scripts
        (playerConfig as Vimeo.PlayerConfig).request.files,
      );
      if (!videoSource) {
        throw new VideoHelperError("Failed to get private video source");
      }

      const {
        video: { title, duration },
        request: { text_tracks: subs },
        // @ts-expect-error var from page scripts
      } = playerConfig as Vimeo.PlayerConfig;
      return {
        url: `${this.SITE_ORIGIN}/${videoId}`,
        video_url: videoSource,
        title,
        duration,
        subs,
      };
    } catch (err) {
      Logger.error(
        `Failed to get private video info by video ID: ${videoId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getSubsInfo(videoId: string) {
    try {
      const params = new URLSearchParams({
        per_page: "100",
        fields: "language,type,link",
      }).toString();
      const res = await this.fetch(
        `${this.API_ORIGIN}/videos/${videoId}/texttracks?${params}`,
        {
          headers: {
            Authorization: this.API_KEY,
          },
        },
      );

      const data = (await res.json()) as Vimeo.Error | Vimeo.VideoSubsData;
      if (this.isErrorData(data)) {
        throw new Error(data.developer_message ?? data.error);
      }

      return data;
    } catch (err) {
      Logger.error(
        `Failed to get subtitles info by video ID: ${videoId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const isPrivate = this.isPrivatePlayer();
    if (!this.extraInfo) {
      return this.returnBaseData(videoId);
    }

    if (isPrivate) {
      const videoInfo = await this.getPrivateVideoInfo(videoId);
      if (!videoInfo) {
        return undefined;
      }

      const { url, subs, video_url, title, duration } = videoInfo;
      const subtitles = subs.map(
        (sub) =>
          ({
            language: normalizeLang(sub.lang),
            source: "vimeo",
            format: "vtt",
            url: this.SITE_ORIGIN + sub.url,
            isAutoGenerated: sub.lang.includes("autogenerated"),
          }) as VideoDataSubtitle,
      );

      const translationHelp = subtitles.length
        ? ([
            { target: "video_file_url", targetUrl: video_url },
            { target: "subtitles_file_url", targetUrl: subtitles[0].url },
          ] as TranslationHelp[])
        : null;

      return {
        ...(translationHelp
          ? {
              url,
              translationHelp,
            }
          : {
              url: video_url,
            }),
        subtitles,
        title,
        duration,
      };
    }

    if (videoId.startsWith("video/")) {
      videoId = videoId.replace("video/", "");
    }

    if (videoId.includes("/")) {
      videoId = videoId.replace("/", ":");
    }

    const viewerData = await this.getViewerData();
    if (!viewerData) {
      return this.returnBaseData(videoId);
    }

    const videoInfo = await this.getVideoInfo(videoId);
    if (!videoInfo) {
      return this.returnBaseData(videoId);
    }

    const subsData = await this.getSubsInfo(videoId);
    const subtitles = subsData
      ? subsData.data.map(
          (caption) =>
            ({
              language: normalizeLang(caption.language),
              source: "vimeo",
              format: "vtt",
              url: caption.link,
              isAutoGenerated: caption.language.includes("autogen"),
            }) as VideoDataSubtitle,
        )
      : [];

    const { link, duration, name: title, description } = videoInfo;
    return {
      url: link,
      title,
      description,
      subtitles,
      duration,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const embedId = /[^/]+\/[^/]+$/.exec(url.pathname)?.[0];
    if (this.isPrivatePlayer()) {
      return embedId;
    }

    return embedId?.startsWith("video/")
      ? embedId.replace("video/", "")
      : (embedId ?? /[^/]+$/.exec(url.pathname)?.[0]);
  }
}
