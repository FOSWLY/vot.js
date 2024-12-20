import type {
  ServiceConf as CoreServiceConf,
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
}

export type VideoService = CoreVideoService | ExtVideoService;

export interface ServiceConf extends CoreServiceConf<VideoService> {
  selector?: string;
  shadowRoot?: true;
  needBypassCSP?: true;
  needExtraData?: true;
}
