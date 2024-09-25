import { TinyInt } from "../utils.js";
export type ViewerData = {
    user: null;
    jwt: string;
    location: string;
    apiUrl: string;
    viewmasterCdnUrl: string;
    vimeoHttpsUrl: string;
    vuid: string;
    ablincolnConfig: unknown[];
    xsrft: string;
    recaptchaSiteKey: string;
    locale: string;
    locales: string[];
    locale_labels: string[];
    cart: unknown;
    contentViewingPrefs: unknown;
    gdprQualifies: boolean;
    ofcomQualifies: boolean;
    impressumQualifies: boolean;
    terminateContractQualifies: boolean;
    thirdPartyTracking: boolean;
    gdprBannerJS: string;
    shouldOptIntoMarketing: boolean;
    vuidCookieJS: string;
    optOutMobile: boolean;
    ribbonModifier: string;
    googleMapApiKey: string;
    magistoApiHost: string;
    omnisearchDisabled: null;
    facebookAppId: number;
    screen_recorder_extension_link: string;
    isMobile: boolean;
    isRecordToolSupported: boolean;
    isPerSeatPricing: boolean;
    recaptchaEnterpriseScoreBasedSiteKey: string;
    isSimplifiedSite: boolean;
    isEnterpriseSite: boolean;
    isFromCopyrightRestrictedRegion: boolean;
    turnstileSiteKey: string;
    terms_show_privacy_choices: boolean;
    vatConfig: unknown;
};
export type Error = {
    error: string;
    link?: string;
    developer_message?: string;
    error_code?: number;
};
export type VideoInfo = {
    name: string;
    description: string;
    link: string;
    duration: number;
};
export type VideoSubtitle = {
    type: "captions";
    language: string;
    id: number;
    link: string;
};
export type PrivateVideo = {
    ai: TinyInt;
    channel_layout: string;
    default_to_hd: TinyInt;
    duration: number;
    embed_code: string;
    embed_permission: "whitelist";
    fps: number;
    height: number;
    id: number;
    live_event: null;
    owner: unknown;
    privacy: "disable" | "anybody";
    rating: Record<"id", number>;
    share_url: string;
    spatial: TinyInt;
    thumbs: Record<string, string>;
    title: string;
    unlisted_hash: null;
    url: string;
    version: unknown;
    video_width?: number;
    video_height?: number;
    width: number;
};
export type PrivateFileCDN = {
    avc_url: string;
    captions?: string;
    origin: "gcs";
    url: string;
};
export type DashStream = {
    fps: number;
    id: string;
    profile: string;
    quality: string;
};
export type PrivateHLSFiles = {
    cdns: Record<string, PrivateFileCDN>;
    default_cdn: string;
    separate_av: boolean;
};
export interface PrivateDashFiles extends PrivateHLSFiles {
    streams: DashStream[];
    streams_avc: DashStream[];
}
export type PrivateFiles = {
    dash: PrivateDashFiles;
    hls: PrivateHLSFiles;
};
export type PrivateVideoSubtitle = {
    kind: "captions";
    lang: string;
    label: string;
    id: number;
    url: string;
};
export type PrivateRequest = {
    ab_tests: unknown;
    ai_widget_signature: string;
    atid: string;
    build: unknown;
    client: Record<"ip", string>;
    cookie: unknown;
    cookie_domain: string;
    country: string;
    currency: string;
    expires: number;
    file_codecs: unknown;
    files: PrivateFiles;
    flags: Record<string, string | number>;
    lang: string;
    referrer: string;
    session: string;
    signature: string;
    text_tracks: PrivateVideoSubtitle[];
    thumb_preview: Record<string, string | number>;
    timestamp: number;
    urls: Record<string, string>;
};
export type PlayerConfig = {
    _colors: Record<string, string>;
    cdn_url: string;
    embed: Record<string, string>;
    player_url: string;
    request: PrivateRequest;
    user: unknown;
    video: PrivateVideo;
    view: number;
    vimeo_api_url: string;
    vimeo_url: string;
};
export type DashFileVideoSegment = {
    start: number;
    end: number;
    url: string;
    size: number;
};
export type DashFileVideo = {
    id: string;
    avg_id: string;
    base_url: string;
    format: "dash" | "mp42";
    mime_type: "video/mp4";
    codecs: string;
    bitrate: number;
    avg_bitrate: number;
    duration: number;
    framerate: number;
    width: number;
    height: number;
    max_segment_duration: number;
    init_segment: string;
    index_segment?: string;
    segments: DashFileVideoSegment[];
};
export interface DashFileAudio extends Omit<DashFileVideo, "framerate" | "mime_type" | "width" | "height"> {
    mime_type: "audio/mp4";
    channels: number;
    sample_rate: number;
}
export type DashFileConfig = {
    clip_id: string;
    base_url: string;
    video: DashFileVideo[];
    audio: DashFileAudio[];
};
export type Paging = {
    next: null | number;
    previous: null | number;
    first: string;
    last: string;
};
export type PaginationResponse<T> = {
    total: number;
    page: number;
    per_page: 100;
    paging: Paging;
    data: T;
};
export type VideoSubsData = PaginationResponse<VideoSubtitle[]>;
export type Data = Error | VideoInfo | VideoSubsData;
//# sourceMappingURL=vimeo.d.ts.map