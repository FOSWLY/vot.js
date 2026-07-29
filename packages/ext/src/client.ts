import VOTCoreClient from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";
import { browserSecHeaders } from "@vot.js/shared/secure";
import type { VideoService } from "./types/service";
import type { VOTProvider } from "@vot.js/core/types/providers/index";
import type { YandexProvider } from "@vot.js/core/providers/yandex";
import type { BaseProvider } from "@vot.js/core/providers/base";

export default class VOTClient<
  V extends string = VideoService,
  C extends VOTProvider<V, BaseProvider<V>> = typeof YandexProvider<V>,
> extends VOTCoreClient<V, C> {
  constructor(opts?: VOTOpts<V, C>) {
    super(opts);
    this.setHeaders();
  }

  setHeaders() {
    this.provider.headers = {
      ...browserSecHeaders,
      ...this.provider.headers,
    };
    return this;
  }
}
