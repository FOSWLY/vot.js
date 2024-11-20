import { BaseHelper } from "./base";

export default class VKHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const pathID = /^\/(video|clip)-?\d{8,9}_\d{9}$/.exec(url.pathname);
    if (pathID) {
      return (pathID as RegExpMatchArray)[0].slice(1);
    }

    const paramZ = url.searchParams.get("z");
    if (paramZ) {
      return paramZ.split("/")[0];
    }

    const paramOID = url.searchParams.get("oid");
    const paramID = url.searchParams.get("id");
    if (paramOID && paramID) {
      return `video-${Math.abs(parseInt(paramOID))}_${paramID}`;
    }

    return undefined;
  }
}
