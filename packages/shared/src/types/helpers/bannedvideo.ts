export enum TypeName {
  Channel = "Channel",
  Video = "Video",
}

export type OperationName = "getVideo";

export type ChannelInfo = {
  _id: string;
  title: string;
  avatar: string;
  __typename: TypeName.Channel;
};

export type VideoInfo = {
  title: string;
  description: string;
  duration: number;
  // streamUrl: string; // m3u8
  videoUrl: string; // mp4
  isStream: boolean;
};

export type GraphQLResponse = {
  data: Record<OperationName, VideoInfo>;
  extensions: unknown;
};
