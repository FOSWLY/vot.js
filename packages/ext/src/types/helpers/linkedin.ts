export type Source = {
  src: string;
  type: string; // e.g. "video/mp4"
};

export type TextTrackMode = "disabled";

export type TextTrack = {
  // not full typed
  default: boolean;
  id: string;
  kind: "captions";
  label: string;
  language: string; // e.g. en
  loaded_: boolean;
  mode: TextTrackMode;
  preload_: boolean;
  src: string;
};

export type TextTrackObj = {
  length: number;
  tracks_: TextTrack[];
};

export type PlayerCache = {
  currentTime: number;
  duration: number;
  inactivityTimeout: number;
  initTime: number;
  lastPlaybackRate: number;
  lastVolume: number;
  media: null;
  playbackRates: number[];
  source: Source;
  sources: Source[];
  src: string;
  volume: number;
};

export type Player = {
  // not full typed
  cache_: PlayerCache;
  el_: PlayerElement;
  isAudio_: boolean;
  isDisposed_: boolean;
  isFullscreen_: boolean;
  isPosterFromTech_: boolean;
  isReady_: boolean;
  language_: string; // user language
  languages_: Record<string, Record<string, string>>; // translations?
  lastSource_: Record<string, string>;
  player_: Player;
  poster_: string;
  textTracks_: TextTrackObj;
};

export interface PlayerElement extends HTMLDivElement {
  player: Player;
}
