import VOTCoreClient, {
  VOTWorkerClient as VOTCoreWorkerClient,
} from "@vot.js/core/client";
export default class VOTClient extends VOTCoreClient {
  constructor(opts) {
    super(opts);
  }
}
export class VOTWorkerClient extends VOTCoreWorkerClient {
  constructor(opts) {
    super(opts);
  }
}
