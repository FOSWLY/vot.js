export type Config = {
  sk: string;
  idClient: string;
};

export type PreloadedData = {
  billingProducts: unknown;
  config: Config;
  defaultFolders: unknown;
  environment: unknown;
  favoriteAlbum: unknown;
  promozavr: unknown;
  settings: unknown;
  space: unknown;
  userCurrent: unknown;
};

export type ResourceModelParams = { id: string };

export type ResourceSize =
  | "DEFAULT"
  | "XXXS"
  | "XXS"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "XXXL";

export type ResourceModelDataSize = {
  url: string;
  name: ResourceSize;
};

export type VideoInfoStream = {
  type: "videoFormat";
  frameRate: number;
  displayAspectRatio: { denom: number; num: number };
  codec: "h264";
  id: string;
  bitRate: number;
  dimension: { width: number; height: number };
};

export type AudioInfoStream = {
  channelsCount: number;
  stereo: boolean;
  sampleFrequency: number;
  type: "audioFormat";
  codec: "aac";
  bitRate: number;
  id: string;
};

export type VideoInfo = {
  duration: number;
  bitRate: number;
  streams: [VideoInfoStream, AudioInfoStream];
  startTime: number;
  format: string;
};

export type ResourceModelData = {
  ctime: 1713525624;
  meta: {
    mimetype: "video/mp4";
    drweb: number;
    uid: string;
    sizes: ResourceModelDataSize[];
    short_url: string;
    resource_id: string;
    mediatype: "video";
    video_info: VideoInfo;
    public_hash: string;
    views_counter: number;
    file_id: string;
    versioning_status: "versionable";
    public: number;
    size: number;
  };
  mtime: number;
  path: string;
  utime: number;
  type: "file";
  id: string;
  name: string; // filename
};

export type ResourceErrorModelData = {
  error: {
    id: string;
    message: string;
    body: unknown;
    type: string;
    statusCode: number;
    code: number;
    title: string;
  };
};

export type ResourceModel = {
  model: "resource";
  params: ResourceModelParams;
  data: ResourceModelData | ResourceErrorModelData;
};

export type ResourceModels = {
  uid: string;
  login: string;
  sk: string;
  version: string;
  models: ResourceModel[];
};
