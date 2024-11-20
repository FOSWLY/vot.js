import { BaseHelper } from "./base";
export default class GoogleDriveHelper extends BaseHelper {
  getPlayerData() {
    const playerEl = document.querySelector("#movie_player");
    return playerEl?.getVideoData?.call() ?? undefined;
  }
  async getVideoId(url) {
    return this.getPlayerData()?.video_id;
  }
}
