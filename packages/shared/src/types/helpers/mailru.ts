export type VideoAuthor = {
  profile: string;
  email: string;
  name: string;
};

export type VideoCluster = {
  name: string;
  id: number;
};

export type VideoRaw = {
  url: string; // without scheme //cdn.my.mail.ru/v/....mp4?...
  seekSchema: 3;
  key: string; // quality 720p, 272p and etc
};

export type VideoMeta = {
  externalId: string; // v/... without /video/ in the middle and .html in the end
  accId: number;
  duration: number;
  viewsCount: number;
  itemId: number;
  timestamp: number; // video upload timestamp
  url: string; // full url from //my.mail.ru/v/...
  id: string; // video id
  title: string;
  poster: string;
};

export type VideoInfo = {
  provider: string;
  multiOverlay: number;
  skipOverlay: boolean;
  isChannel: boolean;
  author: VideoAuthor;
  meta: VideoMeta;
  overlayTime: number;
  relatedHost: null;
  adSlot: null;
  isCommunity: boolean;
  encoding: boolean;
  cluster: VideoCluster;
  targetParent: boolean;
  flags: number;
  admanUrl: string; // js script for ad
  version: number;
  skipAd: boolean;
  isPrivate: boolean;
  region: number;
  savePoint: number;
  service: string; // mail
  spAccess: null;
  sitezone: null;
  backscreenCounter: null;
  videos: VideoRaw[];
};
