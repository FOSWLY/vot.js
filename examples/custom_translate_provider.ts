import { BaseProvider } from "../packages/core/src/providers/base";
import { BaseVideoTranslationOpts } from "../packages/core/src/types/providers/base";
import VOTClient from "../packages/node/src";
import { getVideoData } from "../packages/node/src/utils/videoData";

class CustomProvider extends BaseProvider {
  async translateVideo(
    _opts: BaseVideoTranslationOpts & {
      test: "passed";
    },
  ): ReturnType<BaseProvider["translateVideo"]> {
    throw new Error("Not implemented");
  }
  async getSubtitles(): ReturnType<BaseProvider["getSubtitles"]> {
    throw new Error("Not implemented");
  }
  async translateStream(): ReturnType<BaseProvider["translateStream"]> {
    throw new Error("Not implemented");
  }
}

const client = new VOTClient({
  provider: CustomProvider,
});

const res = await client.translateVideo({
  videoData: await getVideoData("https://youtu.be/LK6nLR1bzpI"),
  test: "passed",
});

console.log(res);
