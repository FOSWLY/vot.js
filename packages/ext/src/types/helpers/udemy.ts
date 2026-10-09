import type * as Udemy from "@vot.js/shared/types/helpers/udemy";

export type UrlCandidate = {
  file?: string;
  src?: string;
  type?: string;
  label?: string | number;
  quality?: string | number;
  height?: string | number;
};

export type UrlCandidatesRecord = {
  Video?: UrlCandidate[];
  video?: UrlCandidate[];
};

export type CaptionWithDownloadUrl = Udemy.Caption & {
  download_url?: string;
  locale?: {
    locale?: string;
  };
};

export type AssetOutput = {
  url?: string;
  type?: string;
  height?: number | string;
};

export type AssetData = {
  outputs?: Record<string, AssetOutput>;
};

export type AssetWithExtraUrls = Udemy.Asset & {
  stream_urls?: unknown;
  download_urls?: unknown;
  stream_url?: string;
  streamUrl?: string;
  external_url?: string;
  data?: AssetData;
};

export type LectureWithViewHtml = Udemy.Lecture & {
  view_html?: string;
};

export type ModuleDataWithExtraFields = Udemy.ModuleData & {
  course_id?: number | string;
  course?: {
    id?: number | string;
  };
};

export type ParsedUrlCandidate = {
  url: string;
  type: string;
  quality: number;
  isYouTubeWatch: boolean;
};
