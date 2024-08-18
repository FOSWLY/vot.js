import { BaseHelper } from "./base.js";
import * as MailRu from "../types/helpers/mailru.js";
export default class MailRuHelper extends BaseHelper {
    API_ORIGIN: string;
    getVideoMeta(videoId: string): Promise<MailRu.VideoInfo | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=mailru.d.ts.map