export type NextDataAsset = {
  __typename: "VideoAsset";
  // mp4
  url: string;
  width: number;
  height: number;
  fps: number;
};

export type NextData = {
  props: {
    pageProps: {
      page: {
        description: string;
        title: string;
        video: {
          __typename: "ModernVideo";
          content: {
            __typename: "ModernContent";
            type: "Video";
            title: string;
            // description
            subtitle: string;
          };
          videoMetadata: {
            __typename: "VideoMetadata";
            duration: number;
            // m3u8
            m3uUrl: string;
          };
          assets: NextDataAsset[];
        };
      };
    };
  };
};

export type ScriptData = {
  contentUrl: string;
  name: string;
  description: string;
};

export type IcmsData = {
  title: string;
  videoId: number;
  // key
  mediaFiles: {
    // quality: mp4
    "2160"?: string;
    "1440"?: string;
    "1080": string;
    "720": string;
    "540": string;
    "480": string;
    "360": string;
  };
  // can be empty
  m3u8: string;
  is_live: boolean;
};
