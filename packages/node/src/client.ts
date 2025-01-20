import VOTCoreClient, {
  VOTWorkerClient as VOTCoreWorkerClient,
} from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";

import { VOTAgent } from "./utils/fetchAgent";

export default class VOTClient extends VOTCoreClient {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.fetchOpts = {
      dispatcher: new VOTAgent(),
      ...this.fetchOpts,
    };
  }
}

export class VOTWorkerClient extends VOTCoreWorkerClient {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.fetchOpts = {
      dispatcher: new VOTAgent(),
      ...this.fetchOpts,
    };
  }
}
