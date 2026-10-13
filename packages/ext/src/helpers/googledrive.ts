import { BaseHelper } from "./base";

type PlayerData = {
  video_id: string;
};

type PlayerElement = Element & {
  getVideoData?: () => PlayerData;
};

export default class GoogleDriveHelper extends BaseHelper {
  getPlayerData(): PlayerData | undefined {
    const playerEl = document.querySelector("#movie_player");
    return (playerEl as PlayerElement | null)?.getVideoData?.() ?? undefined;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(_url: URL) {
    return this.getPlayerData()?.video_id;
  }
}
