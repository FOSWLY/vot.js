import { BaseHelper } from "./base";
type PlayerData = {
  video_id: string;
};
export default class GoogleDriveHelper extends BaseHelper {
  getPlayerData(): PlayerData | undefined;
  getVideoId(url: URL): Promise<string | undefined>;
}
export {};
//# sourceMappingURL=googledrive.d.ts.map
