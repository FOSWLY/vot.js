import { subtitlesFormats } from "../consts";

import { Type, Static } from '@sinclair/typebox'


export type SubtitleFormat = Static<typeof SubtitleFormat>
export const SubtitleFormat = Type.Index((typeof subtitlesFormats), Type.Number())

export type SubtitleToken = Static<typeof SubtitleToken>
export const SubtitleToken = Type.Object({
text: Type.String(),
startMs: Type.Number(),
durationMs: Type.Number()
})

export type SubtitleItem = Static<typeof SubtitleItem>
export const SubtitleItem = Type.Object({
text: Type.String(),
startMs: Type.Number(),
durationMs: Type.Number(),
tokens: Type.Optional(Type.Array(SubtitleToken)),
speakerId: Type.String()
})

export type SubtitlesData = Static<typeof SubtitlesData>
export const SubtitlesData = Type.Object({
containsTokens: Type.Boolean(),
subtitles: Type.Array(SubtitleItem)
})