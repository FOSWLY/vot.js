/**
 * Lesson video payload returned by the `course.getLessonVideo` tRPC query
 * (embedded in the page `__NEXT_DATA__` dehydrated state).
 * Not complete, only the necessary fields.
 */
export type LessonVideo = {
  videoId: number;
  name: string;
  /** Despite the name, it currently contains an HLS (.m3u8) playlist url */
  mp4Url?: string | null;
  webmUrl?: string | null;
  /** Real progressive MP4 url (its file name is NOT derivable from the .m3u8 url) */
  mp4360pUrl?: string | null;
  /** JSON string: { [lang]: { URI: string; NAME: string } } */
  subtitle?: string | null;
};

export type SubtitleInfo = {
  URI: string;
  NAME: string;
};

export type SubtitlesRecord = Record<string, SubtitleInfo>;

export type TrpcQuery = {
  queryKey?: [string[] | string, ...unknown[]];
  state?: {
    data?: {
      video?: LessonVideo;
    } | null;
  };
};

export type NextData = {
  props?: {
    pageProps?: {
      trpcState?: {
        json?: {
          queries?: TrpcQuery[];
        };
      };
    };
  };
};
