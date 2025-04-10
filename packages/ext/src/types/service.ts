import {
  type ServiceConf as CoreServiceConf,
  VideoService as CoreVideoService,
} from "@vot.js/core/types/service";

/**
 * Additional video services supported in extension
 */
export enum ExtVideoService {
  udemy = "udemy",
  coursera = "coursera",
  douyin = "douyin",
  artstation = "artstation",
  kickstarter = "kickstarter",
}

export const VideoService = {
  ...CoreVideoService,
  ...ExtVideoService,
};
export type VideoService = CoreVideoService | ExtVideoService;

export interface ServiceConf<T extends string = VideoService>
  extends CoreServiceConf<T> {
  selector?: string;
  shadowRoot?: true;
  needBypassCSP?: true;
  needExtraData?: true;
}
