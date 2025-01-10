import { PlayerOptions as VideoJSPlayerOptions } from "./videojs";

export type Track = {
  kind: "captions";
  label: string;
  src: string;
  srclang: string;
};

export type PlayerOptions = VideoJSPlayerOptions & {
  courseId?: string;
  tracks: Track[];
};
