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
  datacamp = "datacamp",
  oraclelearn = "oraclelearn",
  deeplearningai = "deeplearningai",
  netacad = "netacad",
  mediafile = "mediafile",
  skilljar = "skilljar",
}

export const VideoService = {
  ...CoreVideoService,
  ...ExtVideoService,
};
export type VideoService = CoreVideoService | ExtVideoService;

export interface ServiceConf<
  T extends string = VideoService,
> extends CoreServiceConf<T> {
  selector?: string;
  eventSelector?: string;
  shadowRoot?: true;
  needBypassCSP?: true;
  needExtraData?: true;
}
