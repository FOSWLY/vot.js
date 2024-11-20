import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as Vimeo from "@vot.js/shared/types/helpers/vimeo";
export default class VimeoHelper extends BaseHelper {
  API_KEY: string;
  DEFAULT_SITE_ORIGIN: string;
  SITE_ORIGIN: string;
  isErrorData(data: Vimeo.Data): data is Vimeo.Error;
  isPrivatePlayer(): boolean | "";
  getViewerData(): Promise<any>;
  getVideoInfo(videoId: string): Promise<any>;
  getPrivateVideoSource(files: Vimeo.PrivateFiles): Promise<string | false>;
  getPrivateVideoInfo(videoId: string): Promise<
    | false
    | {
        url: string;
        video_url: string;
        title: Vimeo.PlayerConfig;
        duration: Vimeo.PlayerConfig;
        subs: Vimeo.PlayerConfig;
      }
  >;
  getSubsInfo(videoId: string): Promise<any>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=vimeo.d.ts.map
