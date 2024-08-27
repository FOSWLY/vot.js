import { SubtitleFormat, SubtitlesData } from "../types/subs.js";
export declare function convertToStrTime(ms: number, delimiter?: string): string;
export declare function convertSubsToJSON(data: string, from?: Exclude<SubtitleFormat, "json">): SubtitlesData;
export declare function getSubsFormat(data: SubtitlesData | string): SubtitleFormat;
export declare function convertSubs(data: SubtitlesData | string, output?: SubtitleFormat): string | SubtitlesData;
//# sourceMappingURL=subs.d.ts.map