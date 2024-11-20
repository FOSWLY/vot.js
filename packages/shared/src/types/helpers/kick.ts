import type { ISODate } from "../utils";

export type Category = {
  id: number;
  banner: string;
  name: string;
  parent_category: string;
  responsive: string;
  slug: string;
};

export type Channel = {
  id: number;
  profile_picture: string;
  slug: string;
  username: string;
};

export type VOD = {
  id: string;
};

export type ClipInfo = {
  category: Category;
  category_id: string;
  channel: Channel;
  channel_id: number;
  clip_url: string; // m3u8 or mp4
  created_at: ISODate;
  creator: Channel;
  duration: number;
  id: string;
  is_mature: boolean;
  liked: boolean;
  likes: number;
  likes_count: number;
  livestream_id: string;
  privacy: "CLIP_PRIVACY_PUBLIC";
  started_at: ISODate;
  thumbnail_url: string;
  title: string;
  user_id: number;
  video_url: string;
  view_count: number;
  views: number;
  vod: VOD;
};

export type UserSocial = {
  profilepic: string;
  bio: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  discord: string;
  tiktok: string;
  username: string;
};

export type UserVerified = {
  id: number;
  channel_id: number;
  created_at: ISODate;
  updated_at: ISODate;
};

export type StreamChannel = {
  id: number;
  user_id: number;
  slug: string;
  is_banned: boolean;
  playback_url: string;
  name_updated_at: string | null;
  vod_enabled: boolean;
  subscription_enabled: boolean;
  followersCount: number;
  user: UserSocial;
  can_host: boolean;
  verified: UserVerified | null;
};

export type StreamCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

export type StreamFullCategory = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  tags: string[];
  description: string;
  deleted_at: null;
  viewers: number;
  category: StreamCategory;
};

export type LiveStream = {
  id: number;
  slug: string;
  channel_id: number;
  created_at: string;
  session_title: string;
  is_live: boolean;
  risk_level_id: null;
  start_time: string;
  source: null;
  twitch_channel: null;
  duration: number; // in ms
  language: string;
  is_mature: boolean;
  viewer_count: number;
  thumbnail: string;
  channel: StreamChannel;
  categories: StreamFullCategory[];
};

export type ClipResponse = {
  clip: ClipInfo;
};

export type VideoResponse = {
  id: number;
  live_stream_id: number;
  slug: null;
  thumb: null;
  s3: null;
  trading_platform_id: null;
  created_at: ISODate;
  updated_at: ISODate;
  uuid: string;
  views: number;
  deleted_at: null;
  source: string; // m3u8 link
  livestream: LiveStream;
};
