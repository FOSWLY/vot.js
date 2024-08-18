import { BaseHelper } from "./base.js";
export default class TwitchHelper extends BaseHelper {
    API_ORIGIN: string;
    getClipLink(pathname: string, clipId: string | null): Promise<string | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=twitch.d.ts.map