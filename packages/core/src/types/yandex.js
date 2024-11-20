export var VideoTranslationStatus;
(function (VideoTranslationStatus) {
  VideoTranslationStatus[(VideoTranslationStatus["FAILED"] = 0)] = "FAILED";
  VideoTranslationStatus[(VideoTranslationStatus["FINISHED"] = 1)] = "FINISHED";
  VideoTranslationStatus[(VideoTranslationStatus["WAITING"] = 2)] = "WAITING";
  VideoTranslationStatus[(VideoTranslationStatus["LONG_WAITING"] = 3)] =
    "LONG_WAITING";
  VideoTranslationStatus[(VideoTranslationStatus["PART_CONTENT"] = 5)] =
    "PART_CONTENT";
  VideoTranslationStatus[(VideoTranslationStatus["AUDIO_REQUESTED"] = 6)] =
    "AUDIO_REQUESTED";
})(VideoTranslationStatus || (VideoTranslationStatus = {}));
export var AudioDownloadType;
(function (AudioDownloadType) {
  AudioDownloadType["WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME"] =
    "web_api_get_all_generating_urls_data_from_iframe";
  AudioDownloadType["WEB_API_REPLACED_FETCH_INSIDE_IFRAME"] =
    "web_api_replaced_fetch_inside_iframe";
  AudioDownloadType["WEB_API_REPLACED_FETCH_FORCE_REQUEST_WITH_SEEK"] =
    "web_api_replaced_fetch_force_request_with_seek";
  AudioDownloadType["WEB_API_REPLACED_FETCH"] = "web_api_replaced_fetch";
  AudioDownloadType["ANDROID_API"] = "android_api";
  AudioDownloadType["WEB_API_SLOW"] = "web_api_slow";
})(AudioDownloadType || (AudioDownloadType = {}));
