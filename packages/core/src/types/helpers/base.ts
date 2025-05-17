import type { FetchFunction, MinimalVideoData } from "../client";
import type { ServiceConf, VideoService } from "../service";

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
  language?: string;
  service?: T;
};

export interface BaseHelperInterface<
  T extends string = VideoService,
  S = ServiceConf,
> {
  API_ORIGIN: string;
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  origin: string;
  service?: S;
  language: string;

  getVideoData(videoId: string): Promise<MinimalVideoData<T> | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
  returnBaseData(videoId: string):
    | {
        url: string;
        videoId: string;
        host: T;
        duration: undefined;
      }
    | undefined;
}
