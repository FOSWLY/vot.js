import { VideoData } from "./client";
import { availableLangs, availableTTS } from "../consts";

import { Type, Static } from '@sinclair/typebox'


export type TranslationHelpTarget = Static<typeof TranslationHelpTarget>
export const TranslationHelpTarget = Type.Union([
Type.Literal("video_file_url"),
Type.Literal("subtitles_file_url")
])

export type SessionModule = Static<typeof SessionModule>
export const SessionModule = Type.Union([
Type.Literal("video-translation"),
Type.Literal("summarization")
])

export type TranslationHelp = Static<typeof TranslationHelp>
export const TranslationHelp = Type.Object({
target: TranslationHelpTarget,
targetUrl: Type.String()
})

export type RequestHeaders = Static<typeof RequestHeaders>
export const RequestHeaders = Type.Record(Type.String(), Type.Any())

export type RequestLang = Static<typeof RequestLang>
export const RequestLang = Type.Index((typeof availableLangs), Type.Number())

export type ResponseLang = Static<typeof ResponseLang>
export const ResponseLang = Type.Index((typeof availableTTS), Type.Number())

export enum EnumVideoService { custom = "custom", directlink = custom, youtube = "youtube", piped = "piped", invidious = "invidious", vk = "vk", nine_gag = "nine_gag", gag = nine_gag, twitch = "twitch", proxitok = "proxitok", tiktok = "tiktok", vimeo = "vimeo", xvideos = "xvideos", pornhub = "pornhub", twitter = "twitter", rumble = "rumble", facebook = "facebook", rutube = "rutube", coub = "coub", bilibili = "bilibili", mail_ru = "mailru", mailru = mail_ru, bitchute = "bitchute", eporner = "eporner", peertube = "peertube", dailymotion = "dailymotion", trovo = "trovo", yandexdisk = "yandexdisk", ok_ru = "okru", okru = ok_ru, googledrive = "googledrive", bannedvideo = "bannedvideo", weverse = "weverse", newgrounds = "newgrounds", egghead = "egghead", youku = "youku", archive = "archive", kodik = "kodik", patreon = "patreon", reddit = "reddit", kick = "kick", apple_developer = "apple_developer", appledeveloper = apple_developer, poketube = "poketube", epicgames = "epicgames", nineanimetv = "nineanimetv", odysee = "odysee", coursehunterLike = "coursehunterLike", sap = "sap", watchpornto = "watchpornto", linkedin = "linkedin", ricktube = "ricktube", incestflix = "incestflix", porntn = "porntn" }

export type VideoService = Static<typeof VideoService>
export const VideoService = Type.Enum(EnumVideoService)

export type ServiceConf = Static<typeof ServiceConf>
export const ServiceConf = Type.Object({
host: VideoService,
url: Type.Optional(Type.String()),
match: Type.Optional(Type.Any()),
rawResult: Type.Optional(Type.Literal(true)),
needExtraData: Type.Optional(Type.Literal(true)),
additionalData: Type.Optional(Type.String())
})

export enum EnumVideoTranslationStatus { FAILED = 0, FINISHED = 1, WAITING = 2, LONG_WAITING = 3, PART_CONTENT = 5, LONG_WAITING_2 = 6 }

export type VideoTranslationStatus = Static<typeof VideoTranslationStatus>
export const VideoTranslationStatus = Type.Enum(EnumVideoTranslationStatus)

export enum EnumAudioInfoMessage { WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME = "web_api_get_all_generating_urls_data_from_iframe", WEB_API_REPLACED_FETCH_INSIDE_IFRAME = "web_api_replaced_fetch_inside_iframe", WEB_API_REPLACED_FETCH_FORCE_REQUEST_WITH_SEEK = "web_api_replaced_fetch_force_request_with_seek", WEB_API_REPLACED_FETCH = "web_api_replaced_fetch", ANDROID_API = "android_api", WEB_API_SLOW = "web_api_slow" }

export type AudioInfoMessage = Static<typeof AudioInfoMessage>
export const AudioInfoMessage = Type.Enum(EnumAudioInfoMessage)

export type VideoTranslationOpts = Static<typeof VideoTranslationOpts>
export const VideoTranslationOpts = Type.Object({
videoData: VideoData,
requestLang: Type.Optional(RequestLang),
responseLang: Type.Optional(ResponseLang),
translationHelp: Type.Optional(Type.Union([
Type.Array(TranslationHelp),
Type.Null()
])),
headers: Type.Optional(RequestHeaders),
shouldSendFailedAudio: Type.Optional(Type.Boolean())
})

export type TranslatedVideoTranslationResponse = Static<typeof TranslatedVideoTranslationResponse>
export const TranslatedVideoTranslationResponse = Type.Object({
translated: Type.Literal(true),
url: Type.String(),
remainingTime: Type.Number(),
message: Type.Optional(Type.String())
})

export type WaitingVideoTranslationResponse = Static<typeof WaitingVideoTranslationResponse>
export const WaitingVideoTranslationResponse = Type.Object({
translated: Type.Literal(false),
remainingTime: Type.Number(),
message: Type.Optional(Type.String())
})

export type VideoTranslationResponse = Static<typeof VideoTranslationResponse>
export const VideoTranslationResponse = Type.Union([
TranslatedVideoTranslationResponse,
WaitingVideoTranslationResponse
])

export type VideoSubtitlesOpts = Static<typeof VideoSubtitlesOpts>
export const VideoSubtitlesOpts = Type.Object({
videoData: VideoData,
requestLang: Type.Optional(RequestLang),
headers: Type.Optional(RequestHeaders)
})

export type StreamPingOptions = Static<typeof StreamPingOptions>
export const StreamPingOptions = Type.Object({
pingId: Type.Number(),
headers: Type.Optional(RequestHeaders)
})

export type StreamTranslationOpts = Static<typeof StreamTranslationOpts>
export const StreamTranslationOpts = Type.Object({
videoData: VideoData,
requestLang: Type.Optional(RequestLang),
responseLang: Type.Optional(ResponseLang),
headers: Type.Optional(RequestHeaders)
})

export type StreamTranslationObject = Static<typeof StreamTranslationObject>
export const StreamTranslationObject = Type.Object({
url: Type.String(),
timestamp: Type.String()
})

export type TranslatedStreamTranslationResponse = Static<typeof TranslatedStreamTranslationResponse>
export const TranslatedStreamTranslationResponse = Type.Object({
translated: Type.Literal(true),
interval: Type.Number(),
result: StreamTranslationObject,
pingId: Type.Number()
})

export type WaitingStreamTranslationResponse = Static<typeof WaitingStreamTranslationResponse>
export const WaitingStreamTranslationResponse = Type.Object({
translated: Type.Literal(false),
interval: Type.Number(),
message: Type.String()
})

export type StreamTranslationResponse = Static<typeof StreamTranslationResponse>
export const StreamTranslationResponse = Type.Union([
TranslatedStreamTranslationResponse,
WaitingStreamTranslationResponse
])

export type VideoTranslationFailAudioResponse = Static<typeof VideoTranslationFailAudioResponse>
export const VideoTranslationFailAudioResponse = Type.Object({
status: Type.Number()
})