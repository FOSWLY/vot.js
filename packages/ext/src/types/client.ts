import { AtLeast } from "@vot.js/shared/types/utils";
import { VideoData } from "@vot.js/core/types/client";
import { type GetVideoDataOpts as CoreGetVideoDataOpts } from "@vot.js/core/types/client";

import { VideoService } from "./service";
import { BaseHelperOpts } from "./helpers/base";

export type MinimalVideoData<T extends string = VideoService> = AtLeast<
  VideoData<T>,
  "url"
>;

export type GetVideoDataOpts = CoreGetVideoDataOpts<BaseHelperOpts>;
