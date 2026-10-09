import { BaseHelper as CoreBaseHelper } from "@vot.js/core/helpers/base";

import type { BaseHelperOpts } from "../types/helpers/base";
import type { ServiceConf, VideoService } from "../types/service";

export { VideoHelperError } from "@vot.js/core/helpers/base";

/** Extension base: same logic as core, plus DOM/window-derived defaults. */
export class BaseHelper extends CoreBaseHelper<VideoService, ServiceConf> {
  video?: HTMLVideoElement;

  constructor({
    referer = document.referrer ?? `${window.location.origin}/`,
    origin = window.location.origin,
    video,
    ...opts
  }: BaseHelperOpts = {}) {
    super({
      ...opts,
      referer,
      origin: /^(http(s)?):\/\//.test(String(origin))
        ? origin
        : window.location.origin,
    });
    this.API_ORIGIN = window.location.origin;
    this.video = video;
  }
}
