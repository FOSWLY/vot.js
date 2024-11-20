import type {
  ServiceConf as CoreServiceConf,
  VideoService as CoreVideoService,
} from "@vot.js/core/types/service";
export declare enum ExtVideoService {
  udemy = "udemy",
  coursera = "coursera",
}
export type VideoService = CoreVideoService | ExtVideoService;
export interface ServiceConf extends CoreServiceConf<VideoService> {
  selector?: string;
  shadowRoot?: true;
  needBypassCSP?: true;
  needExtraData?: true;
}
//# sourceMappingURL=service.d.ts.map
