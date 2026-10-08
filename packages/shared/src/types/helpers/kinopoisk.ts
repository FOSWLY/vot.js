export type KinopoiskVideoData = {
  url: string;
  videoId: string;
  duration?: number;
  title?: string;
  localizedTitle?: string;
  translationHelp: { target: "video_file_url"; targetUrl: string }[];
};

export type KinopoiskTrailer = {
  id: number;
  streamUrl?: string | null;
  filmId?: number;
  videoContentId?: string;
  duration?: number;
  film?: { id?: number; title?: string; originalTitle?: string };
};

export type KinopoiskWidgetState = {
  models?: { trailers?: Record<string, KinopoiskTrailer | undefined> };
};

export type KinopoiskVideoRef = {
  trailerId: string;
  filmId?: string;
};
