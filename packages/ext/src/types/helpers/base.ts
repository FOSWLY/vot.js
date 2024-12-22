import { BaseHelperOpts as CoreBaseHelperOpts } from "@vot.js/core/types/helpers/base";

import { ServiceConf } from "../service";

export interface BaseHelperOpts extends CoreBaseHelperOpts<ServiceConf> {
  video?: HTMLVideoElement;
}
