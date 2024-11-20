import VOTCoreClient, {
  VOTWorkerClient as VOTCoreWorkerClient,
} from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";

export default class VOTClient extends VOTCoreClient {
  constructor(opts?: VOTOpts) {
    super(opts);
  }
}

export class VOTWorkerClient extends VOTCoreWorkerClient {
  constructor(opts?: VOTOpts) {
    super(opts);
  }
}
