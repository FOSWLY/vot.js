import {
  type ServiceConf as CoreServiceConf,
  VideoService as CoreVideoService,
} from "@vot.js/core/types/service";

export const VideoService = {
  ...CoreVideoService,
};
export type VideoService = CoreVideoService;

export type ServiceConf<T extends string = VideoService> = CoreServiceConf<T>;
