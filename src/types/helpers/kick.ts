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
  clip_url: string;
  created_at: string;
  creator: Channel;
  duration: number;
  id: string;
  is_mature: boolean;
  liked: boolean;
  likes: number;
  likes_count: number;
  livestream_id: string;
  privacy: "CLIP_PRIVACY_PUBLIC";
  started_at: string;
  thumbnail_url: string;
  title: string;
  user_id: number;
  video_url: string;
  view_count: number;
  views: number;
  vod: VOD;
};

export type Response = {
  clip: ClipInfo;
};
