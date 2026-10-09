import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import ArtplayerHelper from "./artplayer";
import type { BasePlayer } from "./base";
import BrightcovePlayerHelper from "./brightcove";
import ClapprPlayerHelper from "./clappr";
import DPlayerHelper from "./dplayer";
import FluidPlayerHelper from "./fluidplayer";
import JWPlayerHelper from "./jwplayer";
import MediaElementPlayerHelper from "./mediaelement";
import VidstackPlayerHelper from "./vidstack";

/**
 * Tries every supported "generic" player helper in priority order
 * and returns data from the first one that recognizes the page
 */
export default class UniversalPlayerHelper implements BasePlayer {
  helpers: BasePlayer[] = [
    new BrightcovePlayerHelper(),
    new MediaElementPlayerHelper(),
    new ArtplayerHelper(),
    new DPlayerHelper(),
    new ClapprPlayerHelper(),
    new VidstackPlayerHelper(),
    new FluidPlayerHelper(),
    new JWPlayerHelper(),
  ];

  /**
   * Player instance can be unavailable (e.g. not assigned to a global variable),
   * so we also check the player container selector
   */
  isDetected(helper: BasePlayer): boolean {
    try {
      if (helper.getPlayer()) return true;
    } catch {}

    const { SELECTOR } = helper.constructor as { SELECTOR?: string };
    return Boolean(SELECTOR && document.querySelector(SELECTOR));
  }

  getActiveHelper(): BasePlayer | undefined {
    return this.helpers.find((helper) => this.isDetected(helper));
  }

  getPlayer() {
    return this.getActiveHelper()?.getPlayer();
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    for (const helper of this.helpers) {
      try {
        if (!this.isDetected(helper)) continue;
        const data = await helper.getVideoData(videoId);
        if (data) return data;
      } catch {}
    }

    return undefined;
  }

  getSubtitles(): VideoDataSubtitle[] {
    return this.getActiveHelper()?.getSubtitles?.() ?? [];
  }
}
