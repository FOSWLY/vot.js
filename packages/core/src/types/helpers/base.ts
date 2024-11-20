import type { FetchFunction } from "../client";
import type { ServiceConf } from "../service";

export type BaseHelperOpts<T = ServiceConf> = {
  /**
   * Fetch function
   *
   * e.g. GM_fetch, ofetch.native and etc
   */
  fetchFn?: FetchFunction;
  /**
   * Get extra info about video (title, description, subtitles) if available
   */
  extraInfo?: boolean;
  referer?: string;
  /**
   * Domain from url, it's used e.g. for api domain
   */
  origin?: string;
  service?: T;
};