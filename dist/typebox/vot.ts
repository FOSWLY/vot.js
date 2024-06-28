import {
  RequestHeaders,
  RequestLang,
  ResponseLang,
  VideoService,
} from "./yandex";

import { Type, Static } from '@sinclair/typebox'


export type TranslationStatus = Static<typeof TranslationStatus>
export const TranslationStatus = Type.Union([
Type.Literal("success"),
Type.Literal("waiting"),
Type.Literal("parted"),
Type.Literal("failed")
])

export type TranslationProvider = Static<typeof TranslationProvider>
export const TranslationProvider = Type.Literal("yandex")

export type VideoTranslationVOTOpts = Static<typeof VideoTranslationVOTOpts>
export const VideoTranslationVOTOpts = Type.Object({
url: Type.String(),
videoId: Type.String(),
service: VideoService,
requestLang: Type.Optional(RequestLang),
responseLang: Type.Optional(ResponseLang),
headers: Type.Optional(RequestHeaders)
})

export type TranslationWaitingResponse = Static<typeof TranslationWaitingResponse>
export const TranslationWaitingResponse = Type.Object({
status: Type.Literal("waiting"),
remainingTime: Type.Number(),
message: Type.String()
})

export type TranslationSuccessResponse = Static<typeof TranslationSuccessResponse>
export const TranslationSuccessResponse = Type.Object({
id: Type.Number(),
status: Type.Literal("success"),
provider: TranslationProvider,
translatedUrl: Type.String(),
message: Type.String(),
createdAt: Type.String()
})

export type TranslationFailedResponse = Static<typeof TranslationFailedResponse>
export const TranslationFailedResponse = Type.Object({
id: Type.Number(),
status: Type.Literal("failed"),
provider: TranslationProvider,
translatedUrl: Type.Null(),
message: Type.String(),
createdAt: Type.String()
})

export type TranslationResponse = Static<typeof TranslationResponse>
export const TranslationResponse = Type.Union([
TranslationWaitingResponse,
TranslationSuccessResponse,
TranslationFailedResponse
])