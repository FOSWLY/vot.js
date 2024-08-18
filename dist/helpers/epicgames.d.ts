import { BaseHelper } from "./base.js";
import * as EpicGames from "../types/helpers/epicgames.js";
export default class EpicGamesHelper extends BaseHelper {
    API_ORIGIN: string;
    getPostInfo(videoId: string): Promise<false | EpicGames.Post>;
    getVideoData(videoId: string): Promise<{
        url: string;
    } | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=epicgames.d.ts.map