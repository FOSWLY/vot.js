import VOTClient from "../dist/client";
import axios from "axios";

// https://github.com/axios/axios
const client = new (class AxiosVOTClient extends VOTClient {
  async request(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
  ) {
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
        data: res.data,
      };
    } catch (err: any) {
      console.error("[vot.js]", err.message);
      return {
        success: false,
        data: null,
      };
    }
  }
})();

const response = await client.translateVideo({
  url: "https://youtu.be/LK6nLR1bzpI",
});

console.log(response);
