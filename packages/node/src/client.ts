import VOTCoreClient from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";
import type { VideoService } from "./types/service";
import { VOTAgent } from "./utils/fetchAgent";
import type { BaseProvider } from "@vot.js/core/providers/base";
import type { VOTProvider } from "@vot.js/core/types/providers/index";
import type { YandexProvider } from "@vot.js/core/providers/yandex";

export default class VOTClient<
  V extends string = VideoService,
  C extends VOTProvider<V, BaseProvider<V>> = typeof YandexProvider<V>,
> extends VOTCoreClient<V, C> {
  constructor(opts?: VOTOpts<V, C>) {
    super(opts);
    this.setFetchOpts();
  }

  setFetchOpts() {
    this.provider.fetchOpts = {
      dispatcher: new VOTAgent(),
      ...this.provider.fetchOpts,
    };
    return this;
  }
}
