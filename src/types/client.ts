import { RequestLang, ResponseLang } from "./yandex";

export type FetchFunction = (
  input: string | URL | Request,
  init?: any,
) => Promise<Response>;

export type NormalizeFunction = (url: string) => Promise<string>;

export type VOTOpts = {
  host?: string;
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
  normalizeFn?: NormalizeFunction;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
};
