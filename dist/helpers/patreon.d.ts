import { BaseHelper } from "./base.js";
import * as Patreon from "../types/helpers/patreon.js";
export default class PatreonHelper extends BaseHelper {
    API_ORIGIN: string;
    getPosts(postId: number | string): Promise<Patreon.PostsResponse | false>;
    getVideoData(postId: string | number): Promise<{
        url: string;
    } | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=patreon.d.ts.map