export class VideoDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoDataError";
  }
}

export const localLinkRe =
  /(file:\/\/(\/)?|(http(s)?:\/\/)(127\.0\.0\.1|localhost|192\.168\.(\d){1,3}\.(\d){1,3}))/;

export const isCustomLink = (url: string): boolean => {
  return !!/\.(m3u8|m4(a|v)|mpd)/.exec(url);
};
