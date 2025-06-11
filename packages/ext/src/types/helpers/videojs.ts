export type Source = {
  src: string;
  type: string; // e.g. "video/mp4"
};

export type TextTrackMode = "disabled" | "hidden";

export type TextTrackV7 = {
  // not full typed
  default: boolean;
  id: string;
  kind: "captions"; // v7 - captions | v8 - subtitles ???
  label: string;
  language: string; // e.g. en
  loaded_: boolean;
  mode: TextTrackMode;
  preload_: boolean;
  src: string;
};

export type TextTrackV8 = {
  // not full typed
  id: string;
  kind: "subtitles" | "metadata";
  label: string;
  language: string; // e.g. en
  mode: TextTrackMode;
  src?: string;
};

export type TextTrack = TextTrackV7 | TextTrackV8;

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

export type PlayerLanguages = Record<string, Record<string, string>>; // translations?

export type PlayerOptions = {
  // not full typed
  language: string;
  languages: PlayerLanguages;
  muted: boolean;
};

export type Player<T extends PlayerOptions = PlayerOptions> = {
  // not full typed
  cache_: PlayerCache;
  el_: PlayerElement<T>;
  isAudio_: boolean;
  isDisposed_: boolean;
  isFullscreen_: boolean;
  isPosterFromTech_: boolean;
  isReady_: boolean;
  language_: string; // user language
  languages_: PlayerLanguages;
  lastSource_: Record<string, string>;
  player_: Player;
  poster_: string;
  options_: T;
  textTracks_?: TextTrackObj;
  currentSources?: Source[];
  textTracks(): TextTrackObj;
  getCache(): PlayerCache;
  duration(): number;
};

export interface PlayerElement<T extends PlayerOptions = PlayerOptions>
  extends HTMLDivElement {
  player: Player<T>;
}
