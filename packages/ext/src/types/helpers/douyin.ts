export type PlayerVideo = {
  src: string;
};

export type PlayerConfig = {
  // not full typed
  duration: number;
  download: boolean;
  lang: string;
  isLive: boolean;
  url: PlayerVideo[];
  vid: string; // video id
  vtype: "MP4";
};

export type Player = {
  // not full typed
  _currentTime: number;
  _duration: number;
  _rate: number;
  config: PlayerConfig;
  vtype: "MP4";
};
