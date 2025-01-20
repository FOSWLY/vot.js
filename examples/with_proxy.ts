import VOTClient from "../packages/node/dist/client";
import { VOTProxyAgent } from "../packages/node/dist/utils/fetchAgent";
import { getVideoData } from "../packages/node/dist/utils/videoData";

const client = new VOTClient({
  fetchOpts: {
    dispatcher: new VOTProxyAgent("http://127.0.0.1:8888"),
  },
});

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");
const response = await client.translateVideo({
  videoData,
});

console.log(response);
