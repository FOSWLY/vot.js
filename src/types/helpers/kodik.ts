export type VideoType = "seria" | "video";
export type VideoId = string;
export type Hash = string;
export type Quality = `${number}p`;

export type Path = `/${VideoType}/${VideoId}/${Hash}/${Quality}`;

export type SecureContent = {
  // from secure content
  d: string; // website domain
  d_sign: string;
  pd: string; // kodik domain
  pd_sign: string;

  // if has an origin or referer header
  ref: string; // website origin, can be empty string
  ref_sign: string;

  advert_debug?: boolean;
  first_url?: boolean;
};

export type SecureData = {
  videoType: VideoType;
  videoId: VideoId;
  hash: Hash;
} & SecureContent;

export type VideoQualityData = {
  src: string; // encrypted url
  type: string; // video format
};

export type VideoReserveVastData = {
  title_small: string;
  src: string;
  async_load: boolean;
  hide_interface: boolean;
  vpaid_target_event: string;
  vpaid_max_load_time: number;
  vpaid_max_start_time: number;
};

export interface VideoVastData extends VideoReserveVastData {
  max_length: number;
  vpaid_start_event: string;
  timer: number;
  save_views: boolean;
  disable_advert_click: number;
  send_stat_method: string;
}

export type VideoData = {
  advert_script: string;
  domain: string; // domain from origin/referer header
  default: number; // default quality
  links: Record<string, VideoQualityData[]>;
  vast: VideoVastData[];
  reserve_vast: VideoReserveVastData[];
  ip: string;
};
