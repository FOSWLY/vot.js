/**
 * not full type
 */
export type PlayUrlAudio = {
  id: number;
  baseUrl?: string;
  base_url: string;
  backupUrl?: string[];
  backup_url: string[];
  bandwidth: number;
  mimeType?: "audio/mp4";
  mime_type: "audio/mp4";
};

/**
 * not full type
 */
export type PlayUrlDashData = {
  duration: number;
  audio: PlayUrlAudio[];
};

export type APIResponse<T> = {
  code: number;
  message: string;
  ttl: number;
  data: T;
};

export type PlayUrlResponse = APIResponse<Record<"dash", PlayUrlDashData>>;
export type BagumiPlayUrlResponse = APIResponse<
  Record<"video_info", Record<"dash", PlayUrlDashData>>
>;

export type Manifest = {
  p: number;
  aid: number;
  /**
   * chapter id
   */
  cid: number;
  pid: number;
  /**
   * global video id
   * null - for bagumi videos
   */
  bvid: null | string;
  /**
   * only bagumi videos
   */
  seasonId: null | number;
  /**
   * only bagumi videos
   */
  episodeId: null | number;
  kind: number;
  screenKind: number;
  channelKind: number;
  quality: number;
  seasonType: number;
  hasPrev: boolean;
  hasNext: boolean;
  hasPipFn: boolean;
  hasFullscreenFn: boolean;
  referrer: string;
} & (
  | {
      bvid: null;
      seasonId: number;
      episodeId: number;
    }
  | {
      bvid: string;
      seasonId: null;
      episodeId: null;
    }
);

export type Player = {
  getDuration(): number;
  getManifest(): Manifest;
};

export type PlayInitialState = {
  player: {
    playUrl: {
      value: Record<"dash", PlayUrlDashData>;
    };
  };
};
