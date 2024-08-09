import VOTClient from "../dist/client";
import axios from "axios";
import { ClientResponse } from "../dist/types/client";
import { getVideoData } from "../dist/utils/videoData";

// https://github.com/axios/axios
const client = new (class AxiosVOTClient extends VOTClient {
  async request(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
  ): Promise<ClientResponse> {
    try {
      const res = await axios({
        url: `https://${this.host}${path}`,
        method: "POST",
        headers: {
          ...this.headers,
          ...headers,
        },
        data: body,
        responseType: "arraybuffer",
        ...this.fetchOpts,
      });
      return {
        success: res.status === 200,
        data: res.data as ClientResponse,
      };
    } catch (err: unknown) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }
})();

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");
const response = await client.translateVideo({
  videoData,
});

console.log(response);
