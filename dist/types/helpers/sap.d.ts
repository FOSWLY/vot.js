export type sessionResponse = {
    partnerId: number;
    ks: string;
    userId: number;
    objectType: "KalturaStartWidgetSessionResponse";
};
export type MediaEntry = {
    id: string;
    name: string;
    description: string;
    creatorId: string;
    type: number;
    createdAt: number;
    updatedAt: number;
    downloadUrl: string;
    plays: number;
    views: number;
    duration: number;
    dataUrl: string;
    flavorParamsIds: string;
    objectType: "KalturaMediaEntry";
};
export type BaseEntryListResponse = {
    totalCount: number;
    objects: MediaEntry[];
    objectType: "KalturaBaseEntryListResponse";
};
export type PlaybackSource = {
    deliveryProfileId: number;
    format: "url" | "hdnetworkmanifest" | "mpegdash" | "hdnetwork" | "applehttp" | "rtsp";
    protocols: "http,https" | "http" | "rtmp,rtmpe,rtmpt,rtmpte" | "https";
    flavorIds: string;
    url: string;
    drm: unknown[];
    objectType: "KalturaPlaybackSource";
};
export type PlaybackCaption = {
    label: string;
    format: string;
    language: string;
    webVttUrl: string;
    url: string;
    isDefault: boolean;
    languageCode: string;
    objectType: "KalturaCaptionPlaybackPluginData";
};
export type FlavorAsset = {
    id: string;
    entryId: string;
    partnerId: number;
    version: string;
    size: number;
    tags: string;
    fileExt: string;
    createdAt: number;
    updatedAt: number;
    description: string;
    sizeInBytes: string;
    flavorParamsId: number;
    width: number;
    height: number;
    bitrate: number;
    frameRate: number;
    isOriginal: boolean;
    isWeb: boolean;
    containerFormat: string;
    videoCodecId: string;
    status: number;
    language: string;
    isDefault: false;
    objectType: "KalturaFlavorAsset";
};
export type PlaybackContextResponse = {
    sources: PlaybackSource[];
    playbackCaptions: PlaybackCaption[];
    flavorAssets: FlavorAsset[];
    actions: unknown[];
    messages: unknown[];
    bumperData: unknown[];
    objectType: "KalturaPlaybackContext";
};
export type Response = [
    sessionResponse,
    BaseEntryListResponse,
    PlaybackContextResponse
];
//# sourceMappingURL=sap.d.ts.map