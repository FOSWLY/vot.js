export type PlayerVideoSource = {
  src: string;
  type: string;
};

export type PlayerVideoItem = {
  duration: number;
  sources: PlayerVideoSource[];
  src: string;
  type: string;
  /**
   * same as src
   */
  url: string;
};

export type Player = {
  video: PlayerVideoItem;
};
