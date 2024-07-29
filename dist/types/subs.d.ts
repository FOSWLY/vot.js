import { subtitlesFormats } from "../consts.js";
export type SubtitleFormat = (typeof subtitlesFormats)[number];
export type SubtitleToken = {
    text: string;
    startMs: number;
    durationMs: number;
};
export type SubtitleItem = {
    text: string;
    startMs: number;
    durationMs: number;
    tokens?: SubtitleToken[];
    speakerId: string;
};
export type SubtitlesDate = {
    containsTokens: boolean;
    subtitles: SubtitleItem[];
};
//# sourceMappingURL=subs.d.ts.map