import { RequestLang, ResponseLang } from "./yandex";
export type FetchFunction = (input: string | URL | Request, init?: any) => Promise<Response>;
export type NormalizeFunction = (url: string) => Promise<string>;
export type VOTOpts = {
    host?: string;
    fetchFn?: FetchFunction;
    fetchOpts?: Record<string, unknown>;
    normalizeFn?: NormalizeFunction;
    requestLang?: RequestLang;
    responseLang?: ResponseLang;
};
//# sourceMappingURL=client.d.ts.map