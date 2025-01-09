import VOTCoreClient, {
  VOTWorkerClient as VOTCoreWorkerClient,
} from "@vot.js/core/client";
import type { VOTOpts } from "@vot.js/core/types/client";
import config from "@vot.js/shared/config";

const { componentVersion } = config;

export const secHeaders = {
  "sec-ch-ua": `"Chromium";v="130", "YaBrowser";v="${componentVersion.slice(0, 5)}", "Not?A_Brand";v="99", "Yowser";v="2.5"`,
  "sec-ch-ua-full-version-list": `"Chromium";v="130.0.6723.152", "YaBrowser";v="${componentVersion}", "Not?A_Brand";v="99.0.0.0", "Yowser";v="2.5"`,
};

export default class VOTClient extends VOTCoreClient {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.headers = {
      ...secHeaders,
      ...this.headers,
    };
  }
}

export class VOTWorkerClient extends VOTCoreWorkerClient {
  constructor(opts?: VOTOpts) {
    super(opts);
    this.headers = {
      ...secHeaders,
      ...this.headers,
    };
  }
}
