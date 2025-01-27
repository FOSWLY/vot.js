import VOTCoreClient, {
  VOTWorkerClient as VOTCoreWorkerClient,
} from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";
import { browserSecHeaders } from "@vot.js/shared/secure";

export default class VOTClient extends VOTCoreClient {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.headers = {
      ...browserSecHeaders,
      ...this.headers,
    };
  }
}

export class VOTWorkerClient extends VOTCoreWorkerClient {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.headers = {
      ...browserSecHeaders,
      ...this.headers,
    };
  }
}
