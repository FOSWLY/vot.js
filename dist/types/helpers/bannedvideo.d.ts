export type ISODate = string;
export declare enum TypeName {
    Channel = "Channel",
    Video = "Video"
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
    videoUrl: string;
    isStream: boolean;
};
export type GraphQLResponse = {
    data: Record<OperationName, VideoInfo>;
    extensions: unknown;
};
//# sourceMappingURL=bannedvideo.d.ts.map