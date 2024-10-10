import { BaseHelper } from "./base.js";
export default class VKHelper extends BaseHelper {
    async getVideoId(url) {
        const pathID = /^\/(video|clip)-?\d{8,9}_\d{9}$/.exec(url.pathname);
        if (pathID) {
            return pathID[0].slice(1);
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
