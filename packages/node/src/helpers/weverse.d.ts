import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as Weverse from "@vot.js/shared/types/helpers/weverse";
export default class WeverseHelper extends BaseHelper {
  API_ORIGIN: string;
  API_APP_ID: string;
  API_HMAC_KEY: string;
  HEADERS: {
    Accept: string;
    Origin: string;
    Referer: string;
  };
  getURLData(): {
    appId: string;
    language: string;
    os: string;
    platform: string;
    wpf: string;
  };
  createHash(pathname: string): Promise<{
    wmsgpad: string;
    wmd: any;
  }>;
  getHashURLParams(pathname: string): Promise<string>;
  getPostPreview(postId: string): Promise<Weverse.PostPreview | false>;
  getVideoInKey(videoId: number): Promise<any>;
  getVideoInfo(
    infraVideoId: string,
    inkey: string,
    serviceId: string,
  ): Promise<any>;
  extractVideoInfo(videoList: Weverse.Video[]): any;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=weverse.d.ts.map
