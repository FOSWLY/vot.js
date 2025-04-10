import VOTCoreClient, {
  VOTWorkerClient as VOTCoreWorkerClient,
} from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";
import { browserSecHeaders } from "@vot.js/shared/secure";
import { VideoService } from "./types/service";

export default class VOTClient<
  V extends string = VideoService,
> extends VOTCoreClient<V> {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.headers = {
      ...browserSecHeaders,
      ...this.headers,
    };
  }
}

export class VOTWorkerClient<
  V extends string = VideoService,
> extends VOTCoreWorkerClient<V> {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.headers = {
      ...browserSecHeaders,
      ...this.headers,
    };
  }
}
