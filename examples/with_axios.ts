import axios from "axios";

import VOTClient from "../packages/node/dist/client";
import { getVideoData } from "../packages/node/dist/utils/videoData";
import { ClientResponse } from "../packages/core/dist/types/client";
import { YandexProvider } from "../packages/core/src/providers/yandex";

// https://github.com/axios/axios
// better, if you make fetch wrapper for axios
class AxiosYandexProvider extends YandexProvider {
  async request<T = unknown>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    try {
      const res = await axios({
        url: `https://${this.host}${path}`,
        method,
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
        data: res.data as T,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }
}

const client = new VOTClient({
  provider: AxiosYandexProvider,
});

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");
const response = await client.translateVideo({
  videoData,
});

console.log(response);
