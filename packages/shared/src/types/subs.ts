import { subtitlesFormats } from "../data/consts";

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

export type SubtitlesData = {
  containsTokens: boolean;
  subtitles: SubtitleItem[];
};
