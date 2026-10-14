export type Playback = {
  videos?: { list?: { source?: string; useP2P?: boolean }[] };
  MPD?: {
    Period?: {
      AdaptationSet?: {
        Representation?: { BaseURL?: string[]; SegmentTemplate?: unknown[] }[];
      }[];
    }[];
  }[];
};

export type CardResponse = {
  header?: { code: number };
  body?: {
    card?: {
      content?: {
        mediaId?: string;
        vod?: { playable?: boolean; playback?: Playback };
      };
    };
  };
};
