import type { CardResponse } from "@vot.js/shared/types/helpers/navertv";
import { getVideoSrc, querySelectorDeep } from "../utils/dom";
import { BaseHelper } from "./base";

export default class NaverTVHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^\/shorts\/?$/.test(url.pathname)) {
      return url.href;
    }

    const source = getVideoSrc(
      this.video ?? querySelectorDeep<HTMLVideoElement>("video"),
    );
    if (source && /^https?:\/\//.test(source)) {
      return source;
    }

    const mediaId = url.searchParams.get("seedMediaId");
    if (!mediaId) {
      return undefined;
    }

    const params = new URLSearchParams({
      seedType: "SPECIFIC",
      seedMediaId: mediaId,
      serviceType: url.searchParams.get("serviceType") ?? "CLIP",
      mediaType: url.searchParams.get("mediaType") ?? "SHORT_FORM",
      userInteraction: "true",
    });
    const res = await this.fetch(
      `https://creatorhub-api.naver.com/api/v7.0/clipviewer/card?${params}`,
      { credentials: "include" },
    );
    if (!res.ok) {
      return undefined;
    }

    const data = (await res.json()) as CardResponse;
    const content = data.body?.card?.content;
    if (
      data.header?.code !== 0 ||
      content?.mediaId?.toLowerCase() !== mediaId.toLowerCase() ||
      !content?.vod?.playable
    ) {
      return undefined;
    }

    const playback = content.vod.playback;
    const direct = playback?.videos?.list?.find(
      (video) => !video.useP2P && /^https?:\/\//.test(video.source ?? ""),
    )?.source;
    if (direct) {
      return direct;
    }

    return playback?.MPD?.flatMap((mpd) => mpd.Period ?? [])
      .flatMap((period) => period.AdaptationSet ?? [])
      .flatMap((set) => set.Representation ?? [])
      .filter((video) => !video.SegmentTemplate)
      .flatMap((video) => video.BaseURL ?? [])
      .find((stream) => /^https?:\/\/.*\.mp4(?:[?#]|$)/i.test(stream));
  }
}
