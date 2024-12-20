import { ISODate } from "@vot.js/shared/types/utils";

export type Subtitle = {
  id: number;
  locale: string;
  file_url: string;
  format: "str" | "vtt";
};

export type Chapter = {
  id: number;
  hash_id: string;
  slug: string;
  title: string;
  position: number;
  free: boolean;
  viewed: boolean;
  duration: number;
  subtitles: Subtitle[];
};

export type Level = "beginner" | "intermediate";
export type AutoPlayData = {
  chapter_id: number;
  playback_time: number;
  drm_token: null;
};

export type Course = {
  id: number;
  hash_id: string;
  slug: string;
  title: string;
  description: string; // with html
  medium_cover_url: string;
  larget_cover_url: string;
  published_at: ISODate;
  level: Level;
  duration: number;
  series_hash_id: null | string;
  likes_count: number;
  learners_count: number;
  liked: boolean;
  playlist: unknown[];
  instructors: unknown[];
  chapters: Chapter[];
  topics: unknown[];
  attached_files: unknown[];
  autoplay_data: AutoPlayData;
};

export type VideoUrlData = {
  url: string;
  type: "quicksilver";
};
