export class VideoDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "VideoDataError";
    this.message = message;
  }
}
export const localLinkRe =
  /(file:\/\/(\/)?|(http(s)?:\/\/)(127\.0\.0\.1|localhost|192\.168\.(\d){1,3}\.(\d){1,3}))/;
