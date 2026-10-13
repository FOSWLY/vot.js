import { BaseHelper, VideoHelperError } from "./base";
const abcnewsUrlPattern = new RegExp(
  "^https?://(?:abcnews\\.go\\.com/(?:(?:[^/]+/)*video/(?<display_id>[0-9a-z-]+)-|video/(?:embed|itemfeed)\\?(?:[^#]*&)?id=)|fivethirtyeight\\.abcnews\\.go\\.com/video/embed/\\d+/)(?<id>\\d+)(?=$|[/?#&])",
);
export function parseAbcNewsVideoId(url: string): string | undefined {
  return abcnewsUrlPattern.exec(url)?.groups?.id;
}
export default class AbcNewsHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseAbcNewsVideoId(url.href);
  }
}
