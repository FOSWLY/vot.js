export type VideoAuthor = {
    profile: string;
    email: string;
    name: string;
};
export type VideoCluster = {
    name: string;
    id: number;
};
export type VideoRaw = {
    url: string;
    seekSchema: 3;
    key: string;
};
export type VideoMeta = {
    externalId: string;
    accId: number;
    duration: number;
    viewsCount: number;
    itemId: number;
    timestamp: number;
    url: string;
    id: string;
    title: string;
    poster: string;
};
export type VideoInfo = {
    provider: string;
    multiOverlay: number;
    skipOverlay: boolean;
    isChannel: boolean;
    author: VideoAuthor;
    meta: VideoMeta;
    overlayTime: number;
    relatedHost: null;
    adSlot: null;
    isCommunity: boolean;
    encoding: boolean;
    cluster: VideoCluster;
    targetParent: boolean;
    flags: number;
    admanUrl: string;
    version: number;
    skipAd: boolean;
    isPrivate: boolean;
    region: number;
    savePoint: number;
    service: string;
    spAccess: null;
    sitezone: null;
    backscreenCounter: null;
    videos: VideoRaw[];
};
//# sourceMappingURL=mailru.d.ts.map