export type ISODate = string;
export type StringBoolean = "true" | "false";
export type EnableStatus = "on" | "off";
export type Dimension = "uhd" | "normal"; // maybe smth else

export type Thumbnail = {
  type: string;
  url: string;
  playTime?: number;
};

export type MediaInfoCategory = {
  id: number;
  type: string;
  title: string;
};

export type MediaInfoChatProfile = {
  memberId: string;
  communityId: number;
  profileType: string;
};

export type MediaInfoArtiesMessage = {
  paging: unknown;
  data: unknown[];
};

export type MediaInfoChat = {
  chatId: string;
  enable: boolean;
  availableActions: string[]; // READ_CHAT
  messageCount: number;
  myProfile: MediaInfoChatProfile;
  artistMessages: MediaInfoArtiesMessage;
};

export type PostVideoInfo = {
  videoId: number;
  type: string;
  onAirStartAt: number;
  paid: boolean;
  membershipOnly: boolean;
  screenOrientation: string; // PORTRAIT
  thumb: string; // link to thumbnail
  previewType: string; // NONE
  previewYn: boolean;
  playCount: number;
  likeCount: number;
  streamingCount: number;
  serviceName: string; // weverse
  serviceId: string;
  liveToVod: boolean;
  closedCaptioned: boolean;
  infraVideoId: string;
  playTime: number;
  encodingStatus: string;
  thumbType: string;
  pushYn: boolean;
  vodNotiStatus: string; // OFF
  exposeWithPost: boolean;
};

export type PostAuthorProfileBirthday = {
  dateString: string;
  bday: boolean;
};

export type PostAuthorOfficialProfile = {
  officialImageUrl: string;
  officialName: string;
  birthday: PostAuthorProfileBirthday;
};

export type PostAuthor = {
  memberId: string;
  communityId: number;
  joined: boolean;
  profileName: string;
  profileImageUrl: string;
  memberJoinStatus: string; // JOIN_COMMUNITY
  profileType: string; // ARTIST
  artistOfficialProfile?: PostAuthorOfficialProfile;
  hasOfficialMark: boolean;
  profileSpaceStatus: string; // ACCESSIBLE
  myProfile: boolean;
};

export type Community = {
  communityId: number;
  communityName: string;
  logoImage: string;
  homeHeaderImage: string;
  artistCode: string;
};

export type PostMediaInfo = {
  mediaType: string; // VOD
  thumbnail: Thumbnail;
  exposeToMediaTab?: false;
  categories?: MediaInfoCategory[];
  chat: MediaInfoChat;
  body: string;
  title: string;
};

export type PostExtension = {
  mediaInfo: PostMediaInfo;
  video: PostVideoInfo;
};

export type PostSummary = {
  thumbnails: Thumbnail[];
  videoCount: number;
  photoCount: number;
  snippets: unknown[];
};

export type PostPreview = {
  extension: PostExtension;
  attachment: unknown;
  summary: PostSummary;
  publishedAt: number;
  postType: string; // VIDEO
  postId: string;
  sectionType: string; // LIVE
  body: string;
  title: string;
  author: PostAuthor;
  community: Community;
};

export type AdParamCustom = {
  cmi: string;
  mi: string;
  vt: string;
  hl: string;
};

export type AdParam = {
  scheduleId: string;
  pre: boolean;
  mid: boolean;
  post: boolean;
  playTime: number;
  custom: AdParamCustom;
  cmi: number;
  vi: number;
  vt: string; // VOD
};

export type InKey = {
  inKey: string;
  adParam: AdParam;
};

export type VideoProvider = {
  name: string;
};

export type VideoCover = {
  type: string;
  source: string;
};

export type VideoAdvertise = {
  usable: boolean;
  useInline: boolean;
  url: string;
  info: string;
};

export type VideoShare = {
  usable: boolean;
  count: number;
  onlyInnerServices: boolean;
};

export type VideoUser = {
  id: string;
  name: string;
  url: string;
};

export type VideoAPICallbackData = {
  cpn: string;
  cpid: string;
  tid: string;
};

export type VideoAPI = {
  name: string;
  source: string; // api link
  offset: number;
  callbackData?: VideoAPICallbackData;
};

export type Display = {
  visible: StringBoolean;
};

export type RulesSplitVOD = {
  version: number;
  fadeInTime: number;
  fadeOutTime: number;
  playbackRewindTime: number;
};

export type RulesPreloadingMidAD = {
  version: number;
  offset: number;
  showNotice: boolean;
  noticeTime: number;
};

export type RulesAdFreeZone = {
  version: number;
  zone: string;
  offset: number;
};

export type EncodingOptions = {
  id: string;
  name: string; // quality
  width: number;
  height: number;
};

export interface VideoEncodingOptions extends EncodingOptions {
  profile: string;
  isEncodingComplete: StringBoolean;
  completeProgress: string;
}

export type VideoBitrate = {
  video: number;
  audio: number;
};

export type Video = {
  id: string;
  useP2P: boolean;
  duration: number;
  previewDuration: number;
  size: number;
  type: string; // codec (e.g. avc1)
  encodingOption: VideoEncodingOptions;
  bitrate: VideoBitrate;
  p2pMetaUrl: string;
  p2pUrl: string;
  source: string; // link to video
  sourceFrom: string;
};

export type StreamKey = {
  type: string; // param
  name: string;
  value: string;
};

export type StreamVideoTemplateBody = {
  bandwidth: number;
  resolution: string; // "480x270"
  format: string; // format of segments (e.g. 2bc53ba3-900b-11ee-9f1b-80615f0bce44-%06d.ts)
  version: "3";
  mediaSequence: number;
  extInfos: number[];
};

export type StreamVideoTemplate = {
  type: "HLS_V3";
  body: StreamVideoTemplateBody;
};

export type StreamVideo = {
  id: string;
  encodingOption: EncodingOptions;
  bitrate: VideoBitrate;
  source: string; // m3u8 link
  sourceFrom: string;
  template: StreamVideoTemplate;
};

export type Stream = {
  type: "HLS";
  enableABR: EnableStatus;
  dimension: Dimension;
  keys: StreamKey[];
  source: string; // m3u8 link
  sourceFrom: string;
  videos: StreamVideo;
};

export type VideoThumbnailItem = {
  time: number;
  source: string;
};

export type VideoThumbnailSprite = {
  type: string;
  totalPage: number;
  rowCount: number;
  columnCount: number;
  intervalType: string; // millisecond
  interval: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  allThumbnailCount: number;
  sourcePatternType: string; // SEQUENCE_PATTERN
  source: string;
};

export type TrackingStatPolicy = {
  event: string;
  timeTable?: number[];
  type: string;
  urL: string;
};

export type VideoInfoMetaRules = {
  splitVod: RulesSplitVOD;
  preloadingMidAd: RulesPreloadingMidAD;
  adFreeZone: RulesAdFreeZone;
};

export type VideoInfoMeta = {
  masterVideoId: string;
  contentId: string;
  serviceId: number;
  count: number;
  interfaceLang: string;
  url: string; // prod.weverse/video/[subject]
  homeUrl: string; // prod.weverse
  provider: VideoProvider;
  subject: number;
  cover: VideoCover;
  advertise: VideoAdvertise;
  share: VideoShare;
  user: VideoUser;
  apiList: VideoAPI[];
  display: Record<string, Display>;
  rules: VideoInfoMetaRules;
  countryCode: string;
  encodingModel: string; // NONE
};

export type VideoInfoVideos = {
  type: "video";
  hasPreview: StringBoolean;
  isPreview: boolean;
  canAutoPlay: boolean;
  isMultiTrack: boolean;
  dimension: Dimension;
  list: Video[];
};

export type VideoInfoThumbnails = {
  list: VideoThumbnailItem[];
  sprites: VideoThumbnailSprite[];
};

export type VideoInfoTrackings = {
  "stat-policy": TrackingStatPolicy[];
};

export type LoudnessNormalizationProperties = {
  mode: string; // youtube-like
  targetLoudness: number;
};

export type ExternalFeatureLoudnessNormalization = {
  enable: boolean;
  version: string; // "1.1.4"
  contentType: string; // application/octet-stream
  contentEncoding: string; // BASE64_SAFE
  data: string;
  properties: LoudnessNormalizationProperties;
};

export type VideoInfoExternalFeature = {
  loudnessNormalization: ExternalFeatureLoudnessNormalization;
};

export type VideoInfo = {
  tId: string;
  transactionCreatedTime: number;
  serverTime: ISODate;
  expireTime: ISODate; // serverTime + ~2.5 hours
  meta: VideoInfoMeta;
  videos: VideoInfoVideos;
  streams: Stream[];
  thumbnails: VideoInfoThumbnails;
  trackings: VideoInfoTrackings;
  externalFeature: VideoInfoExternalFeature;
};
