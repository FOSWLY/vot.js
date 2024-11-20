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
  format:
    | "url"
    | "hdnetworkmanifest"
    | "mpegdash"
    | "hdnetwork"
    | "applehttp"
    | "rtsp";
  protocols: "http,https" | "http" | "rtmp,rtmpe,rtmpt,rtmpte" | "https";
  flavorIds: string;
  url: string;
  drm: unknown[];
  objectType: "KalturaPlaybackSource";
};

export type PlaybackCaption = {
  label: string; // has suffix "(auto-generated)" for some subs
  format: string; // 3
  language: string;
  webVttUrl: string; // direct url to vtt file
  url: string;
  isDefault: boolean;
  languageCode: string;
  objectType: "KalturaCaptionPlaybackPluginData";
};

export type FlavorAsset = {
  id: string;
  entryId: string;
  partnerId: number;
  version: string; // 1
  size: number;
  tags: string;
  fileExt: string; // mp4
  createdAt: number;
  updatedAt: number;
  description: string; // desc of video track!!!
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
  status: number; // 2
  language: string; // Undefined
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
  PlaybackContextResponse,
];

// ext
export type SchemaItem = {
  "@type": "VideoObject";
  creator: {
    url: string;
  };
};

export type Schema = {
  "@graph": SchemaItem[];
};
