import { ofetch } from "ofetch";

import VOTClient from "../packages/node/dist/client";
import { getVideoData } from "../packages/node/dist/utils/videoData";

// https://github.com/unjs/ofetch
const client = new VOTClient({
  fetchFn: ofetch.native,
});

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI", {
  fetchFn: ofetch.native,
});
const response = await client.translateVideo({
  videoData,
});

console.log(response);
