/** Why it's need? Answer: https://github.com/nodejs/undici/issues/1305 */

import { ProxyAgent, Agent } from "undici";
import DispatcherBase from "undici/lib/dispatcher/dispatcher-base.js";
import type Dispatcher from "undici/types/dispatcher";

/** Partial pasted from undici/lib/dispatcher/proxy-agent.js */
export class VOTAgent extends DispatcherBase {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
    this["proxy agent"] = new Agent();
  }

  dispatch(
    opts: Dispatcher.DispatchOptions,
    handler: Dispatcher.DispatchHandler,
  ) {
    delete (opts.headers as Record<string, string>)["sec-fetch-mode"];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this["proxy agent"].dispatch(opts, handler);
  }
}

export class VOTProxyAgent extends ProxyAgent {
  constructor(opts: ProxyAgent.Options | string) {
    super(opts);
  }

  dispatch(
    opts: Dispatcher.DispatchOptions,
    handler: Dispatcher.DispatchHandler,
  ) {
    delete (opts.headers as Record<string, string>)["sec-fetch-mode"];
    return super.dispatch(opts, handler);
  }
}
