import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as Patreon from "@vot.js/shared/types/helpers/patreon";
export default class PatreonHelper extends BaseHelper {
  API_ORIGIN: string;
  getPosts(postId: number | string): Promise<Patreon.PostsResponse | false>;
  getVideoData(postId: string | number): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=patreon.d.ts.map
