import { TinyInt } from "@vot.js/shared/types/utils";

export type State = "unstarted" | "playing" | "ended";

export type Subtitle = {
  is_auto?: boolean;
  is_default?: boolean;
  lang: string;
  manifest_name: string;
  storage_index: number;
  title: string;
  url: string;
};

export type SubtitleLang = {
  lang_id: number;
  name: string;
};

export type PlayerVars = {
  autoplay: number;
  date: number;
  description: string; // with html
  duration: number;
  from_ads: boolean;
  liked: TinyInt;
  md_author: string;
  md_title: string;
};

export interface PlayerVarsWithSubs extends PlayerVars {
  default_subtitle_track_index: string;
  subs: Subtitle[];
  subtitles_lang: Record<string, SubtitleLang>;
}

/**
 * ! not full typed
 */
export type PlayerObject = {
  container: HTMLElement;
  el: HTMLElement;
  embedded: boolean;
  prevState: State;
  state: State;
  vars: PlayerVars | PlayerVarsWithSubs;
  videoLiked: TinyInt;
};

export type Videoview = {
  getPlayerObject?(): PlayerObject;
};
