import { BaseHelper } from "./base";

export default class VKHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const pathID = /^\/((?:video|clip)-?\d+_\d+)(?:\/)?$/.exec(url.pathname);
    if (pathID) {
      return pathID[1];
    }

    const idInsidePlaylist = /\/playlist\/[^/]+\/(video-?\d+_\d+)/.exec(
      url.pathname,
    );
    if (idInsidePlaylist) {
      return idInsidePlaylist[1];
    }

    const paramZ = url.searchParams.get("z");
    if (paramZ) {
      return paramZ.split("/")[0];
    }

    const paramOID = url.searchParams.get("oid");
    const paramID = url.searchParams.get("id");
    if (paramOID && paramID) {
      const ownerId = Math.abs(Number.parseInt(paramOID, 10));
      if (!Number.isNaN(ownerId)) {
        return `video-${ownerId}_${paramID}`;
      }
    }

    return undefined;
  }
}
