import type * as Vimeo from "@vot.js/shared/types/helpers/vimeo";

export type CdnGroup = {
  url?: string;
  default_cdn?: string;
  cdns?: Record<string, { url?: string }>;
};

export type ProgressiveFile = {
  url?: string;
  height?: number;
};

export type Files = {
  progressive?: ProgressiveFile[];
  dash?: CdnGroup;
  hls?: CdnGroup;
};

export type DashTrack = {
  format?: string;
  mime_type?: string;
  codecs?: string;
  codec?: string;
  id?: string;
  quality?: string;
  base_url?: string;
  segments?: { url?: string }[];
};

export type DashConfig = {
  base_url?: string;
  audio?: DashTrack[];
  video?: DashTrack[];
};

export type ConfigRequest = {
  files?: Files;
  text_tracks?: Vimeo.PrivateVideoSubtitle[];
  textTracks?: Vimeo.PrivateVideoSubtitle[];
};

export type PlayerConfig = ConfigRequest & {
  request?: ConfigRequest;
  video?: { title?: string; name?: string; duration?: number };
};
