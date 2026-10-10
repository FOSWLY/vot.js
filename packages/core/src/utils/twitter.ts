/** Minimal shapes of the public syndication `tweet-result` response. */
export type TweetVariant = {
  bitrate?: number;
  content_type?: string;
  url?: string;
};

export type TweetVideoInfo = {
  duration_millis?: number;
  variants?: TweetVariant[];
};

export type TweetResultData = {
  text?: string;
  mediaDetails?: {
    type?: string;
    video_info?: TweetVideoInfo;
  }[];
  video?: {
    durationMs?: number;
    variants?: {
      bitrate?: number;
      type?: string;
      src?: string;
    }[];
  };
};

/**
 * The syndication endpoint requires a token, but does not validate it;
 * compute the canonical one the same way the embed player (and yt-dlp) does:
 * `((id / 1e15) * Math.PI).toString(36)` without `0`s and dots.
 */
export function getSyndicationToken(videoId: string): string {
  return ((Number(videoId) / 1e15) * Math.PI).toString(36).replace(/[0.]/g, "");
}

/** Unify camelCase and snake_case video fields of the response. */
export function getTweetVideoInfo(
  data: TweetResultData,
): TweetVideoInfo | undefined {
  const mediaInfo = data.mediaDetails?.find(
    (item) => item.type === "video",
  )?.video_info;
  if (mediaInfo) return mediaInfo;
  if (!data.video) return undefined;
  return {
    duration_millis: data.video.durationMs,
    variants: data.video.variants?.map((variant) => ({
      bitrate: variant.bitrate,
      content_type: variant.type,
      url: variant.src,
    })),
  };
}

/** Pick the best progressive MP4 variant, falling back to HLS. */
export function selectTweetVideo(info: TweetVideoInfo | undefined):
  | {
      url?: string;
      duration?: number;
    }
  | undefined {
  if (!info) return undefined;
  const variants = (info.variants ?? []).filter((variant) => variant.url);
  const mp4 = variants
    .filter((variant) => variant.content_type === "video/mp4")
    .toSorted((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];
  const hls = variants.find(
    (variant) => variant.content_type === "application/x-mpegURL",
  );
  return {
    url: mp4?.url ?? hls?.url,
    duration:
      info.duration_millis && info.duration_millis > 0
        ? info.duration_millis / 1000
        : undefined,
  };
}
