/**
 * Why is this needed?
 *
 * Undici (Node's fetch implementation) adds certain fetch metadata headers
 * that some upstreams reject. See: https://github.com/nodejs/undici/issues/1305
 */

import { Agent, Dispatcher1Wrapper, ProxyAgent } from "undici";
import type Dispatcher from "undici/types/dispatcher";

export class VOTAgent extends Dispatcher1Wrapper {
  constructor() {
    super(new Agent());
  }

  dispatch(
    opts: Dispatcher.DispatchOptions,
    handler: Dispatcher.DispatchHandler,
  ) {
    if (opts.headers && typeof opts.headers === "object") {
      delete (opts.headers as Record<string, string>)["sec-fetch-mode"];
    }
    return super.dispatch(opts, handler);
  }
}

export class VOTProxyAgent extends Dispatcher1Wrapper {
  constructor(options: ProxyAgent.Options | string) {
    super(new ProxyAgent(options));
  }

  dispatch(
    opts: Dispatcher.DispatchOptions,
    handler: Dispatcher.DispatchHandler,
  ) {
    if (opts.headers && typeof opts.headers === "object") {
      delete (opts.headers as Record<string, string>)["sec-fetch-mode"];
    }
    return super.dispatch(opts, handler);
  }
}
