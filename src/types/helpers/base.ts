import { FetchFunction } from "../client";
import { ServiceConf } from "../yandex";

export type BaseHelperOpts = {
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  extraInfo?: boolean; // get extra info about video (title, description, subtitles) if available
  referer?: string;
  origin?: string; // domain from url, it's used e.g. for api domain
  service?: ServiceConf;
};
