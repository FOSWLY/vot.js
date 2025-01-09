import { BaseHelper, VideoHelperError } from "./base";
import { MinimalVideoData } from "../types/client";

import * as Loom from "../types/helpers/loom";
import { config } from "@vot.js/shared";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";

export default class LoomHelper extends BaseHelper {
  getClientVersion() {
    // @ts-expect-error var from page scripts
    if (typeof SENTRY_RELEASE === "undefined") {
      return undefined;
    }

    // @ts-expect-error var from page scripts
    const release = SENTRY_RELEASE as Loom.SentryRelease;
    return release?.id;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const clientVer = this.getClientVersion();
      if (!clientVer) {
        throw new VideoHelperError("Failed to get client version");
      }

      const res = await this.fetch("https://www.loom.com/graphql", {
        headers: {
          "User-Agent": config.userAgent,
          "content-type": "application/json",
          "x-loom-request-source": `loom_web_${clientVer}`,
          "apollographql-client-name": "web",
          "apollographql-client-version": clientVer,
          "Alt-Used": "www.loom.com",
        },
        body: `{"operationName":"FetchCaptions","variables":{"videoId":"${videoId}"},"query":"query FetchCaptions($videoId: ID!, $password: String) {\\n  fetchVideoTranscript(videoId: $videoId, password: $password) {\\n    ... on VideoTranscriptDetails {\\n      id\\n      captions_source_url\\n      language\\n      __typename\\n    }\\n    ... on GenericError {\\n      message\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}`,
        method: "POST",
      });

      if (res.status !== 200) {
        throw new VideoHelperError("Failed to get data from graphql");
      }

      const result = (await res.json()) as Loom.VideoTranscript;
      const data = result.data.fetchVideoTranscript;
      if (data.__typename === "GenericError") {
        throw new VideoHelperError(data.message);
      }

      return {
        url: this.service!.url + videoId,
        subtitles: [
          {
            format: "vtt",
            language: normalizeLang(data.language),
            source: "loom",
            url: data.captions_source_url,
          },
        ],
      };
    } catch (err) {
      Logger.error(
        `Failed to get Loom video data, because: ${(err as Error).message}`,
      );
      return this.returnBaseData(videoId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /(embed|share)\/([^/]+)?/.exec(url.pathname)?.[2];
  }
}
