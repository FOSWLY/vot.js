import { BaseHelper } from "./base";

type PlayerData = {
  video_id: string;
};

export default class GoogleDriveHelper extends BaseHelper {
  getPlayerData(): PlayerData | undefined {
    const playerEl = document.querySelector("#movie_player");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return ((playerEl as any)?.getVideoData?.call() as PlayerData) ?? undefined;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return this.getPlayerData()?.video_id;
  }
}
