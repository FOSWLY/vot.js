import { FetchFunction } from "../client";

export type BaseHelperOpts = {
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
};
