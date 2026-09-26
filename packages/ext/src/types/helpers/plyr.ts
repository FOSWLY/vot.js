/**
 * i don't see real type, but i guess it's like this
 */
export type Track = {
  src: string;
  kind: string;
  srclang?: string;
  lang?: string;
};

/**
 *  not full typed
 */
export type PlayerConfig = {
  /**
   * number as string
   */
  duration: string;
  muted: boolean;
  title: string;
  /**
   * volume as 0.0 - 1.0
   */
  volume: number;
  tracks?: Track[];
};

/**
 * not full typed
 */
export type Player = {
  config: PlayerConfig;
  ready: boolean;
  media: HTMLVideoElement;
  elements: {
    container: HTMLElement;
    [key: string]: any;
  };
  play(): void;
  pause(): void;
  type: "video";
  currentTime: number;
  duration: number;
  paused: boolean;
  /**
   * volume as 0.0 - 1.0
   */
  volume: number;
  /**
   * ! can be 'blob:...'
   */
  source: string;
  /**
   * ! can be 'blob:...'
   */
  download: string;
  muted: boolean;
};

export interface PlayerElement extends HTMLVideoElement {
  plyr: Player;
}
