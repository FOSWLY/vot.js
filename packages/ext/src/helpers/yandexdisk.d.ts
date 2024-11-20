import { BaseHelper } from "./base";
import * as YandexDisk from "@vot.js/shared/types/helpers/yandexdisk";
export default class YandexDiskHelper extends BaseHelper {
  API_ORIGIN: string;
  CLIENT_PREFIX: string;
  isErrorData(
    data: YandexDisk.ResourceModelData | YandexDisk.ResourceErrorModelData,
  ): data is YandexDisk.ResourceErrorModelData;
  getVideoData(videoId: string): Promise<
    | {
        url: string;
        title?: undefined;
        duration?: undefined;
      }
    | {
        url: any;
        title: any;
        duration: any;
      }
    | undefined
  >;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=yandexdisk.d.ts.map
