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

export type ResourceModelMeta = {
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

export type ResourceModelData = {
  ctime: 1713525624;
  meta: ResourceModelMeta;
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

export type ListingType = "tile" | "icons" | "list";

export type ResourceFullVideoMeta = {
  defaultPreview: string;
  download_counter: number;
  drweb: number;
  ext: string;
  file_id: string;
  hasPreview: boolean;
  lPreview: string;
  mediatype: "video";
  mimetype: "video/mp4";
  page_blocked_items_num: number;
  short_url?: string;
  size: number;
  videoDuration: number;
  views_counter: number;
  xxxlPreview: string;
};

export type ResourceFullDirMeta = {
  download_counter: number;
  file_id: string;
  hasPreview: boolean;
  rights: string[];
  short_url: string;
  views_counter: number;
};

export type ResourceType = "dir" | "file";

export type ResourceFullBaseData = {
  children: string[];
  completed: boolean;
  hash: string;
  id: string;
  isAvailableForVideoPlayer: boolean;
  /**
   * timestamp
   */
  modified: number;
  name: string;
  parent: string | null;
  path: string;
  timestamp: number;
  virus: boolean;
};

export type ResourceFullDirData = ResourceFullBaseData & {
  type: "dir";
  containsOnlyImageAndVideo: boolean;
  countBlockedItems: number;
  isFirstPortionLoaded: boolean;
  loading: boolean;
  meta: ResourceFullDirData;
  publicSavedLink: Record<"is_saved", boolean>;
  uid: string;
};

export type ResourceFullVideoData = ResourceFullBaseData & {
  type: "file";
  meta: ResourceFullVideoMeta;
};

export type Environment = {
  authSk: string;
  availableLangs: string[];
  avatarsOrigin: string;
  countryIsoName: string;
  currentLang: string;
  env: "production";
  experiments: unknown;
  externalSk: string;
  fullTld: string;
  geoTimezone: unknown;
  iosAppMetrikaParams: unknown;
  isYangoPhoto: boolean;
  nda: boolean;
  nonce: string;
  servicesTld: string;
  sk: string;
  version: string;
  videoPlayerIframeApiUrl: string;
  yandexuid: string;
  yapicOrigin: string;
};

export type PrefetchData = {
  // not full typed
  appPromo: unknown;
  currentResourceId: string;
  environment: Environment;
  listingType: ListingType;
  notifications: unknown;
  operations: unknown;
  overlays: unknown;
  photoGrid: unknown;
  promozavr: unknown;
  resources: Record<string, ResourceFullVideoData | ResourceFullDirData>;
  rootResourceId: string;
  selectedResources: unknown[];
  services: Record<string, string>;
  settings: unknown;
  ua: unknown;
  url: unknown;
  user: unknown;
  users: Record<string, unknown>;
  waitingAuthActions: unknown;
  wowListingTypes: ListingType;
};

export type FetchListResponse = {
  completed: boolean;
  resources: (ResourceFullVideoData | ResourceFullDirData)[];
};

export type DownloadUrlResponse = {
  error: boolean;
  statusCode: number;
  code: string;
  data: Record<"url", string>;
};
