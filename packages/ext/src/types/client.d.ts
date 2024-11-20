import { AtLeast } from "@vot.js/shared/types/utils";
import { VideoData } from "@vot.js/core/types/client";
import { VideoService } from "./service";
export type MinimalVideoData<T = VideoService> = AtLeast<VideoData<T>, "url">;
//# sourceMappingURL=client.d.ts.map
