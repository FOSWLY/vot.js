import VOTClient from "../packages/node/dist/client.js";
import { getVideoData } from "../packages/node/dist/utils/videoData.js";

const client = new VOTClient();

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");
const data = await client.translateVideo({
  videoData,
});

console.log(data);
