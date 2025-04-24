import { BaseHelper } from "./base";

import * as Telegram from "../types/helpers/telegram";

declare global {
  const appMediaViewer: Telegram.AppMediaViewer | undefined;
}

export default class TelegramHelper extends BaseHelper {
  static getMediaViewer() {
    if (typeof appMediaViewer === "undefined") {
      return undefined;
    }

    return appMediaViewer;
  }

  async getVideoId(_url: URL) {
    const mediaViewer = TelegramHelper.getMediaViewer();
    if (!mediaViewer) {
      return undefined;
    }

    if (mediaViewer.live) {
      return undefined;
    }

    const message = mediaViewer.target.message;
    if (message.peer_id._ !== "peerChannel") {
      return undefined;
    }

    const media = message.media;
    if (media._ !== "messageMediaDocument") {
      return undefined;
    }

    if (media.document.type !== "video") {
      return undefined;
    }

    const postId = message.mid & 0xffffffff;
    const username = await mediaViewer.managers.appPeersManager.getPeerUsername(
      message.peerId,
    );

    return `${username}/${postId}`;
  }
}
