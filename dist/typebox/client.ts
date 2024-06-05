import { RequestLang, ResponseLang } from "./yandex";

import { Type, Static } from '@sinclair/typebox'


export type FetchFunction = Static<typeof FetchFunction>
export const FetchFunction = Type.Function([Type.Union([
Type.String(),
Type.Never(),
Type.Never()
]), Type.Optional(Type.Any())], Type.Promise(Type.Never()))

export type NormalizeFunction = Static<typeof NormalizeFunction>
export const NormalizeFunction = Type.Function([Type.String()], Type.Promise(Type.String()))

export type VOTOpts = Static<typeof VOTOpts>
export const VOTOpts = Type.Object({
host: Type.Optional(Type.String()),
fetchFn: Type.Optional(FetchFunction),
fetchOpts: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
normalizeFn: Type.Optional(NormalizeFunction),
requestLang: Type.Optional(RequestLang),
responseLang: Type.Optional(ResponseLang)
})