import { FetchFunction, MinimalVideoData } from "../types/client";
import { BaseHelperOpts } from "../types/helpers/base";
import { fetchWithTimeout } from "../utils/utils";

export class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}

export class BaseHelper {
  API_ORIGIN = "https://example.com";
  fetch: FetchFunction;

  constructor({ fetchFn = fetchWithTimeout }: BaseHelperOpts = {}) {
    this.fetch = fetchFn;
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async getVideoId(url: URL): Promise<string | undefined> {
    return undefined;
  }
}
