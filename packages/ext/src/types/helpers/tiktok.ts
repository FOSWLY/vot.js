export type BirtrateUrlItems = [
  // unavailable
  `https://v16-webapp-prime.tiktok.com/video/${string}`,
  // available with tt_chain_token cookie
  `https://v19-webapp-prime.tiktok.com/video/${string}`,
  // unavailable
  `https://www.tiktok.com/aweme/v1/play/${string}`,
];

/**
 * links like `v1X-webapp.tiktokcdn-eu.com` available without any auth
 */
export type SubtitleUrlItems = [
  `https://v16-webapp.tiktokcdn-eu.com/${string}`,
  `https://v19-webapp.tiktokcdn-eu.com/${string}`,
  // unavailable
  `https://www.tiktok.com/aweme/v1/play/${string}`,
];

export type BitrateListItem = {
  bitrate: number;
  duration: number;
  format: "MP4";
  size: number;
  vtype: "MP4";
  codecType: "h265" | "h264";
  url: BirtrateUrlItems;
};

export type TikTokPlayer = {
  bitrateList: BitrateListItem[];
  mediaType: "video";
  playerType: "NEW_TT";
};

export type BitrateInfoItem = {
  Bitrate: number;
  CodecType: "h264" | "h265_hvc1";
  Format: "mp4";
  PlayAddr: {
    UrlList: BirtrateUrlItems;
  };
};

export type SubtitleListItem = {
  id: string;
  language: string;
  url: SubtitleUrlItems;
  urlExpire: string;
};

export type TikTokVideoDetail = {
  pathId: "video_detail";
  bitrateInfo: BitrateInfoItem[];
  urlList: BirtrateUrlItems;
  videoSource: {
    bitrateList: BitrateListItem[];
    duration: number;
  };
  subtitleList: SubtitleListItem[];
};

export type ReactFiberProp = `__reactFiber$${string}`;

export type TikTokPlayerInFiber = {
  return?: {
    memoizedProps?: {
      player?: TikTokPlayer;
    };
    return?: {
      memoizedProps?: TikTokVideoDetail;
    };
  };
};
