export type PostImage = {
  height: number;
  url: string;
  width: number;
};

export type PostFileThumbnail = {
  position: number;
  url: string;
};

export type PostFileProgress = {
  is_watched: boolean;
  watch_state: string; // is_not_watched
};

export type PostFile = {
  closed_captions_enabled: boolean;
  default_thumbnail: PostFileThumbnail;
  duration: number;
  expires_at: string; // date
  full_content_duration: number;
  height: number;
  media_id: number;
  progress: PostFileProgress;
  state: string; // uploaded
  url: string; // m3u8 link
  video_issues: unknown;
  width: number;
};

export type PostDataAttributes = {
  comment_count: number;
  content: string; // description
  created_at: string; // date
  current_user_can_delete: boolean;
  current_user_can_report: boolean;
  current_user_can_view: boolean;
  deleted_at: string | null;
  edit_url: string; // pathname to edit post
  edited_at: string | null;
  embed: null;
  has_ti_violation: boolean;
  image: PostImage;
  is_automated_monthly_charge: boolean;
  is_paid: boolean;
  like_count: number;
  min_cents_pledged_to_view: number;
  moderation_status: string; // not_being_reviewed
  patreon_url: string; // full patreon pathname to post
  pledge_url: string;
  post_file: PostFile;
  post_level_suspension_removal_date: null;
  post_metadata: null;
  post_type: string; // video_external_file
  preview_asset_type: null;
  published_at: string; // date
  scheduled_for: string; // date
  share_images: Record<string, Record<"url", string>>;
  teaser_text: string;
  thumbnail: PostImage;
  title: string;
  url: string; // full url to post
  video_preview: null;
  was_posted_by_campaign_owner: boolean;
};

export type PostData = {
  attributes: PostDataAttributes;
  id: string;
  relationships?: unknown;
  type: string; // post
};

// without default includes
export type PostsResponse = {
  data: PostData;
  links: Record<string, string>;
  included?: unknown[];
};
