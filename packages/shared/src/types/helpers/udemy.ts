import { ISODate } from "../utils.js";

export type Caption = {
  _class: "caption";
  asset_id: number;
  created: ISODate;
  file_name: string;
  id: number;
  locale_id: string;
  source: string;
  status: number;
  title: string;
  url: string;
  video_label: string;
};

export type MediaSource = {
  label: string;
  src: string;
  type: string;
};

export type Asset = {
  _class: "asset";
  captions: Caption[];
  id: number;
  length: number;
  media_sources: MediaSource[];
};

export type Lecture = {
  _class: "lecture";
  asset: Asset;
  description: string;
  id: number;
  title: string;
};

export type Locale = {
  _class: "locale";
  english_title: string;
  locale: string;
  simple_english_title: string;
  title: string;
};

export type Course = {
  _class: "course";
  id: number;
  locale: Locale;
};

// ext
export type ModuleData = {
  courseId: number;
};

export type ErrorData = {
  detail: string;
};
