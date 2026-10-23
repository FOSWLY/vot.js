export type VideoSourceQuality = "240p" | "360p" | "480p" | "720p HD";

export type VideoSourceItem = {
  labelShort?: string;
  src: string;
  /**
   * e.g. video/mp4
   */
  type: string;
  default: boolean;
};

export type HLSVideoSourceItem = Omit<VideoSourceItem, "labelShort"> & {
  srcFallback: string;
};

export type VideoDataSuccess = {
  /**
   * success
   */
  code: 0;
  message: "";
  sources: {
    mp4: Record<VideoSourceQuality, VideoSourceItem>;
    hls?: Record<"auto", HLSVideoSourceItem>;
  };
};

export type VideoDataFailed = {
  /**
   * auth error
   */
  code: 3;
  message: string;
  sources: {
    mp4: {
      auto: VideoSourceItem;
    };
  };
};

/**
 * not full type
 */
export type VideoData = (VideoDataSuccess | VideoDataFailed) & {
  vid: string;
  duration: number;
};

/**
 * not full type
 */
export type Player = {
  video: {
    player: {
      hash: string;
    };
  };
};
