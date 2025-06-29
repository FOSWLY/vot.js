# 2.4.12

## Ext

- Fix getVideoId on some vimeo link

## Shared

- Bump component version

# 2.4.11

## Core

- Added support set `firstRequest` in `extraOpts` for `translateVideo` method

## Shared

- Updated `VideoTranslationResponse` protobuf schema

## Workspace

- Bump depends

# 2.4.10

## Ext

- Added ignore metadata files from VideoJS subtitles
- Added support `learn-dev.` and `learn-staging.` subdomains for DeeplearningAI
- Added support Netacad
- Added methods to get PO Token for YouTube

## Workspace

- Bump oxlint to 1.0.0
- Removed eslint

# 2.4.9

## Ext

- Added missed field `eventSelector` for `ServiceConf` type
- Added support DeeplearningAI

## Core

- Added support lively voice for vot-backend api (provider `yandex_lively` or autoset by `extraOpts.useLivelyVoice` in `translateVideo` method)

## Shared

- Bump component version
- Updated Chromium version in browser secure headers

# 2.4.8

## Ext

- Added support for Oracle Learn

## Workspace

- Migrated from `prettier` to `biome`
- Migrated from `husky` to `lefthook`
- Removed `eslint-oxlint-plugin`

# 2.4.7

## Ext

- Fixed 9GAG

## Shared

- Bump component version

## Workspace

- Added example to translateVideo with temp url without subtitles
- Moved Oxlint config to `.oxlintrc.json` file
- Bump depends

# 2.4.6

## Ext

- Fixed yandex disk `/client/disk` if file contains whitespaces

# 2.4.5

## Ext

- Added typings for `video` field in getVideoData options

## Core

- Added support custom initial type for GetVideoDataOpts
- Replaced language field type `ResponseLang` to `string` in BaseHelper
- Added BaseHelperInterface type as base for implementations

## Shared

- Bump component version

# 2.4.4

## Core

- Added support authorization with [OAuth token](https://oauth.yandex.ru) to use `useLivelyVoice` feature

```ts
new VOTClient({
  apiToken: "YOUR_OAUTH",
});
```

# 2.4.3

## Ext

- Added proxy video url for coursehunter
- Added typings `loadVideoById`, `pauseVideo` and `mute` methods for Youtube `PlayerElement`

## Node

- Added proxy video url for coursehunter

## Core

- Updated possible values for AudioDownloadType
- (!) Updated `VOTClient.requestVtransAudio` params
- Removed protected from `requestVtransFailAudio` client method

## Shared

- Updated `VideoTranslationCache` protobuf schema
- Updated `ChunkAudioObject` protobuf schema.

  Added separated `PartialAudioBufferObject` schema for `ChunkAudioObject` (field changes: `fileId` (string) -> `chunkId` (int32))

  `unknown0` renamed to `version`

- Updated component version
- Updated sec headers

## Workspace

- Updated getActualVersion (component version) script
- Bump depends

# 2.4.2

## Ext

- Added support Telegram Web K (`https://web.telegram.org/k/`, supports only public channels)

## Node

- Added support Telegram (`t.me`, supports only public channels)

# 2.4.1

## Core, Ext, Node

- Added support get video translation cache (`translateVideoCache`)
- [!] Renamed `useNewModel` to `useLivelyVoice` in translateVideo extraOpts
- Now `uselivelyVoice` is false by default, because it requires `Session_id` cookie in headers

## Shared

- Added TranslateVideoCache request/response to protobuf
- [!] Renamed `useNewModel` to `useLivelyVoice` in protobuf
- Renamed `unknown1` to `isLivelyVoice` in VideoTranslation protobuf request
- Updated component version to `25.4.x`

# 2.4.0

## Ext

- Added export VideoService as enum (earlier only as type)
- Added support custom VideoService type for VOTClient
- Added support unlisted embed and groups/channels/album/showcase videos for Vimeo
- Fixed invalid VideoService type in videoData property
- Fixed `/client/disk` for Yandex Disk
- Fixed Kodik decrypt url
- Replaced disable eslint rules to declare global for global vars from page
- Fixed Vimeo bug where getVideoData didn’t retrieve the correct data for private players when extraInfo was disabled.
- Rework getVideoId for Vimeo Helper

## Node

- Added export VideoService as enum (earlier only as type)
- Added support custom VideoService type for VOTClient
- Added support unlisted embed and groups/channels/album/showcase videos for Vimeo
- Fixed Kodik decrypt url
- Fixed Vimeo bug where getVideoData didn’t retrieve the correct data for private players when extraInfo was disabled.
- Rework getVideoId for Vimeo Helper

## Core

- Added support custom VideoService type for VOTClient

```ts
import VOTClient from "@vot.js/node";

// enum
enum CustomVideoService {
  example = "example",
  test = "test",
}
const client = new VOTClient<CustomVideoService>();
await client.translateVideo({
  videoData: {
    url: "https://example.com/123",
    host: CustomVideoService.example,
    videoId: "123",
  },
});

// literal union
type OtherVideoService = "example" | "test";
const otherClient = new VOTClient<OtherVideoService>();
await otherClient.translateVideo({
  videoData: {
    url: "https://example.com/123",
    host: "test",
    videoId: "123",
  },
});
```

- Removed `"X-Use-Snake-Case": "Yes"` for VOT Backend

## Shared

- Bump component version

## Workspace

- Disabled update proto file in Github Actions build
- Updated PornTN test url
- Updated Vimeo test urls
- Replaced bun spawn `pretty-quick` to `prettier` in `update:config` script
- Bump depends

# 2.3.12

Now RapidCloud use wasm and fake file types for video player... no comments

## Ext

- Added support IMDb
- Removed broken 9AnimeTV (RapidCloud)

## Node

- Added support IMDb
- Removed broken 9AnimeTV (RapidCloud)

# 2.3.11

## Ext

- Added support `/videos/VIDEO_ID` with Global IGN (`www.ign.com`)
- Fixed some GetVideoId for some VK videos

## Node

- Added support `/videos/VIDEO_ID` with Global IGN (`www.ign.com`)
- Fixed Regional IGN
- Fixed some GetVideoId for some VK videos

## Shared

- Added IGN types

# 2.3.10

## Ext

- Added support Bunkr

## Node

- Added support Bunkr

# 2.3.9

## Ext

- Added support IGN

## Node

- Added support IGN

# 2.3.8

## Ext

- Enabled bypass CSP for Loom

## Workspace

- Bump depends

# 2.3.7

## Node

- Fix Kodik
- Added support `.org` tld for PornHub
- Added support `uv`, `episode`, `season`, `serial` video type for Kodik

## Ext

- Fix Kodik
- Added support `.org` tld for PornHub
- Added support `uv`, `episode`, `season`, `serial` video type for Kodik
- Removed extra request for Kodik

## Shared

- Updated Kodik types

# 2.3.6

## Ext

- Fixed invalid isErrorData check in Udemy helper

# 2.3.5

## Ext, Node, Core

- Added support ThisVid

## Shared

- Updated Yandex protobuf

## Workspace

- Bump depends

# 2.3.4

## Ext

- Added support Kickstarter
- Some type improves in CoursehunterLike and Odysee helpers

## Shared

- Added support detect VTT subs with text after WEBVTT word on first line (e.g. `WEBVTT -- English`)

## Workspace

- Bump depends

# 2.3.3

## Ext

- Added support /d/VIDEO_ID for Yandex Disk

## Node

- Added support /d/VIDEO_ID for Yandex Disk

## Workspace

- Bump depends

# 2.3.2

## Ext

- Removed extra YT Shorts service instead of this we use more stable YT Mobile service

# 2.3.1

## Ext

- Added error handling for Udemy helper
- Updated YT shorts selector & match logic

## Shared

- Added Udemy data error type

# 2.3.0

## Core

- Added support get subtitles for m3u8 urls with VOTBackend
- (!) Removed "unknown" fields from get subtitles yandex response. It needs for unified response with VOTBackend
- VOTBackend `/translate` migrated to snake_case body style

## Workspace

- Bump depends

# 2.2.6

## Shared

- Updated Ya component version
- Updated Ya user agent and sec-ua-\* headers

## Workspace

- Rewritted typebox generation logic with `@toil/typebox-genx`

# 2.2.5

## Ext

- Added support last VOD on user offline page for Twitch
- Added support getVideoData for Twitch
- Added getVideoId for Twitch live stream

# 2.2.4

## Shared

- Fix invalid token name for `Ya-Summary`
- Removed generating signature header for `Ya-Summary`
- Now body in `getSecYaHeaders` required undefined for `Ya-Summary`

## Workspace

- Bump dev depends

# 2.2.3

## Shared

- Added better typings for getSecYaHeaders function
- Added `SecYaHeader` & `SecYaHeaders` typings

# 2.2.2

## Core

- Set new fields for stream requests

## Shared

- Updated Stream Yandex Protobuf

# 2.2.1

## Ext

- Removed export secure browser headers

## Core

- Small typings improvements

## Shared

- Added export browser secure headers

## Workspace

- Added build without updating proto

# 2.2.0

## Core

> [!CAUTION]
> BREAKING CHANGES! Protobuf export was devided into 2 abstract classes

- Added MinimalClient with only request method and sessions logic for your own logic
- Added export VOTJSError
- (!) Export yandexProtobuf was devided into 2 abstract classes (YandexVOTProtobuf, YandexSessionProtobuf)
- (!) Renamed Protobuf methods:
  - `encodeYandexSessionRequest` -> `encodeSessionRequest` (YandexSessionProtobuf)
  - `decodeYandexSessionResponse` -> `decodeSessionResponse` (YandexSessionProtobuf)
- Now VOTClient extends MinimalClient

## Shared

> [!CAUTION]
> BREAKING CHANGES! ProtobufJS replaced to `@bufbuild/protobuf`

- (!) ProtobufJS replaced to `@bufbuild/protobuf`
- Added new values to SecType and to SessionModule
- (dev) ts-proto bumped to 2.6.1

## Workspace

- Bump depends

# 2.1.13

## Core

- Added option to set videoTitle and wasStream to TranslationExtraOpts

## Shared

- Updated Yandex Protobuf

# 2.1.12

## Ext

- Fix YouTube Helper methods for early loading ([voice-over-translation#1055](https://github.com/ilyhalight/voice-over-translation/issues/1055))

# 2.1.11

## Ext

- Added exports from client file
- Added selector for Bitview

## Node

- Added exports from client file
- Added exports VOTProxyAgent to set HTTP/HTTPS proxy for node fetch (wrapper of undici ProxyAgent)
- Fixed get video translations and get subtitles via Node.js (402 error)

## Core

- Added exports from client file

## Shared

- Fixed compatibility with running javascript files via Node.js (renamed autogen `protobufjs/minimal` -> `protobufjs/minimal.js`)

## Workspace

- Bump depends

# 2.1.10

## Ext

- Added support Bitview

## Node

- Added support Bitview

# 2.1.9

## Ext

- Updated Developer EpicGames logic for support multi iframes

## Node

- Added headers for Yandex Disk to try to avoid triggering captcha
- Added use clear link to Yandex Disk /d/ if getVideoData failed

# 2.1.8

## Ext

> [!CAUTION]
> BREAKING CHANGES! Some helpers types have been removed or modified!

- Added shared VideoJS Helper class
- Added Coursera player types
- Added support Coursera lecture preview
- Merged linkedin and coursera types to videojs
- Set getPlayerObject optional for VK Player type
- getDefault methods inside helpers replaced with returnBaseData method
- Now DouyinHelper.getPlayer is static method
- Improved some typings
- Removed linkedin types

## Shared

- Removed Coursera player types

# 2.1.7

## Ext

- Added getVideoData for YouTube
- Added support jsapi embed YouTube

## Core

- Added optional language property to getVideoData options
- Added optional localizedTitle property to VideoData

# 2.1.6

## Ext

- Added default values for `sec-ch-ua` and `sec-ch-ua-full-version-list` headers

## Shared

- Updated Yandex UserAgent

# 2.1.5

## Ext

- Added support RT News (rt.com)
- Added support some new domains for XVideos

## Node

- Added support RT News (rt.com)
- Added support some new domains for XVideos

## Core

- Added RT News service

## Workspace

- Added prettier to dev depends to work properly with the IDEs Auto Formatter

# 2.1.4

## Ext

- Added support all yandex disk tlds
- Added support yandex disk /d/

## Node

- Added support all yandex disk tlds
- Added support yandex disk /d/
- Replaced all `replace("<!DOCTYPE html>", "")` to case insensitive variant

## Shared

- Removed encodeURIComponent for href in proxyMedia

# 2.1.3

## Ext

- Fixed mobile VKVideo

## Workspace

- Updated vot-worker domain in readme
- Removed useless fields from workspace package.json

# 2.1.2

## Ext

- Added getVideoId by player for Douyin

# 2.1.1

## Ext

- Fix client Yandex Disk duration

# 2.1.0

## Ext

> [!WARNING]
> Breaking changes in getVideoId and getVideoData params

- Added support getVideoId for Twitter feed
- Added export Artstation and Loom helper types
- Added param `video` to BaseHelperOpts
- Removed param `video` for `getVideoId` and `getVideoData` funcs

## Workspace

- Update depends

# 2.0.19

## Core

- Fixed default host for VOTWorkerClient

## Shared

- Added `hostWorker` to config

# 2.0.18

## Ext

- Fix Artstation Helper

# 2.0.17

## Ext

- Added support Artstation
- Removed extra unknown type for try/catch in EpicGames helepr

## Node

- Removed extra unknown type for try/catch in EpicGames helepr

## Shared

- Fix detect VTT subs with IDs if ID ends with `\r\n`

# 2.0.16

## Ext

- Enabled needExtraData for Loom

## Shared

- Added support convert VTT subs with IDs

# 2.0.15

## Ext

- Added support Loom
- Fix get video ID for VK Playlist with videoXXXXX_XXXXXXX

## Node

- Added support Loom
- Fix get video ID for VK Playlist with videoXXXXX_XXXXXXX

## Shared

- Added GraphQL placeholder type
- Bannedvideo helper type GraphQLResponse renamed to GetVideoResponse

# 2.0.14

## Ext

- Fix VK Mobile getVideoData
- Added extra checks for global variables from window

# 2.0.13

## Ext

- Change XVideos selector

# 2.0.12

## Ext

- Fixed invalid douyin helper in available helpers

# 2.0.11

## Ext

- Added support Douyin
- Added export linkedin types

# 2.0.10

## Ext

- Changed linkedin subtitles and video url logic
- Added support linkedin logined
- Added linkedin player types

## Node

- Added linkedin types

## Shared

- Removed linkedin types

# 2.0.9

## Ext

- Fix EpicGames helper

## Node

- Fix EpicGames helper

# 2.0.8

## Ext

- Added support Cloudflare Stream

## Node

- Added support Cloudflare Strems

## Core

- Added Cloudflare Stream to VideoService enum

# 2.0.7

## Ext

- Enabled always use getVideoData for VK
- Added support VK Video Playlists

## Node

- Added support VK Video Playlists

## Shared

- Fix detect VTT subtitles type => fix convert VTT subs with multilang metadata

# 2.0.6

## Ext

- Added getVideoData for VK
- Added source param for subtitles in getVideoData

## Node

- Added source param for subtitles in getVideoData

## Core

- Added required source param and optional translatedFromLanguage param for VideoDataSubtitle

# 2.0.5

## Ext

- Fixed OK.ru selector ([voice-over-translation#900](https://github.com/ilyhalight/voice-over-translation/issues/900))

# 2.0.4

## Core

- Added debug log in translateVideoYaImpl function

## Ext (unpublished)

- Added support new VK Video domain (vkvideo.ru)

## Node

- Added support new VK Video domain (vkvideo.ru)

## Workspace

- Bump oxlint depends
- Removed generated code which shouldn't have been originally

# 2.0.3

## All

- Fix @vot.js/\* depends

# 2.0.2

## Shared

- Fix get crypto

# 2.0.1

## All

- Fixed README for all packages

# 2.0.0

In this update, the library logic has been completely redesigned.

**Now, the vot.js package is considered obsolete, and his place was taken by @vot.js/shared, @vot.js/core, @vot.js/node and @vot.js/ext**

## Ext

- Added support Udemy and Coursera (copied from patches from [voice-over-translation](https://github.com/ilyhalight/voice-over-translation) extension)
- Rewrited AppleDeveloper, CoursehunterLike, Dailymotion, GoogleDrive, Incestflix, Kodik, Linkedin, 9AnimeTV, PornTN, Reddit, Sap, Twitch, Vimeo, Weverse, YandexDisk helpers for better perfomance and compatibility with DOM API (copied from patches from [voice-over-translation](https://github.com/ilyhalight/voice-over-translation) extension)
- The logic used in Node is adapted to work in the browser extension

## Core

- The range 192.168.x.x has been added to the local address check
- The ability to pass "getVideoDataFn" in VOTOpts has been removed (it hasn't been used for a long time)
- Added description and missing exported functions/variables

## Node

- Protobuf export has been moved to @vot.js/shared
- Helper types export has been moved to @vot.js/shared
- The check of the local address has been moved to @vot.js/core
- Updated examples

## Shared

- Added support for using a string url in proxyMedia
- Added description and missing exported functions/variables

# 1.5.0

- Added support set audio parts to requestVtransAudio
- Added set status value (VideoTranslationStatus) and translationId value to translateVideo response
- Status LONG_WAITING_2 renamed to AUDIO_REQUESTED
- The sending of fail audio with the LONG_WAITING status code has been removed
- Now requestVtransAudio has 3rd required param - audioBuffer
- Updated Yandex Protobuf

# 1.4.1

- Added base64 encoding of url in proxyMedia function

# 1.4.0

- All websites from getVideoID switch/case moved to separated helpers
- Added Dzen support (dzen.ru)
- Added config schema type
- Removed sonarjs eslint plugin

# 1.3.10

- Added the ability to install extra translation options: `forceSourceLang`, `bypassCache`, `useNewModel` (read description before use!)
- Added option to enable using new model voices in some cases ([desc](https://github.com/ilyhalight/voice-over-translation/issues/897))
- Updated Yandex Protobuf

# 1.3.9

- Fixed incorrect generation of Sec-{Vsubs|Vtrans}-Token (#36)
- Yandex Sec headers generation has been combined into the getSecYaHeaders function and moved to secure.ts

# 1.3.8

- Added logging level setting that can be edited using the global configuration
- Package version info moved to config to reduce for the minimum version of nodejs

# 1.3.7

- Now protobufjs is part of dependencies. Previously, it was pulled from ts-proto dependencies, but for some reason, it stopped working

# 1.3.6

- Updated VOT Worker requests logic

# 1.3.5

- Fixed long waiting for translation for new translation requests for YouTube (status = 6)
- Added a blank function for video-translation/audio (now return only empty audio info for continue video translation)
- Updated Yandex Protobuf

# 1.3.4

- Added Incestflix mirrors with https support

# 1.3.3

- Coursehunter and Coursetrain logic are merged to CoursehunterLike

# 1.3.2

- Added Coursetrain support (coursetrain.net)
- Added Ricktube support (ricktube.ru)
- Added Incestflix support (incestflix.com)
- Added PornTN support (porntn.com) (maybe doesn't work, now site on Maintenance)
- Getting video ID for `yandexdisk`, `vk` and `trovo` has been moved in a separate helpers

# 1.3.1

- Improved the work of constructing links to private videos for vimeo embed

# 1.3.0

> [!CAUTION]
> After the update, if you patch files or use the Video Helper class you need to migrate to the new logic of working with VideoHelper

- Reworked logic of VideoHelper to improve typing. Now, to get a helper, you need to create an instance of VideoHelper and call the getHelper method with the necessary service
- Added additional params to getVideoData and getVideoId
- Added info about title, description and subs for Vimeo
- Now, on Vimeo, the id of the embedded video is equal to the regular one if it's public
- Added fetch error handling for some video helpers
- Removed app_id query param for Vimeo (Maybe no more is needed)
- Fixed match Linkedin domain without `www.`

# 1.2.9

- Added support Watchporn.to embed
- Fix Watchporn.to getVideoId
- Fix Kick getVideoData for new format of videos and clips

# 1.2.8

- Fix Kick getVideoId for new format of videos and clips

# 1.2.7

- Added support Linkedin learning
- Added support raw `.webm` links
- Added support Watchporn.to
- Added support Sap `/learning-journeys` path

# 1.2.6

- Fix VTT/SRT converter for work with invalid lines type

# 1.2.5

- Added isAutoGenerated field for some websites subtitles
- Added Sap Learning support (learning.sap.com)

# 1.2.4

- Fix VTT/SRT converter for work with subtitles that have stylization

# 1.2.3

- Fix VTT/SRT converter for subtitles with CRLF ending
- Fix VTT/SRT converter for work with multi-line paragraphs

# 1.2.2

- Fix 9animetv set hash filename as subtitles language

# 1.2.1

- Removed export `convertSubsToJSON` function

# 1.2.0

- Added normalize lang function
- Added convert string time to ms function (e.g. 00:06:16,460 --> 376460)
- Added get internal video subtitles from EpicGames and 9AnimeTV
- Function `convertToStrTime` now accepts milliseconds instead of seconds, also added extra timestamp delimiter argument
- Improved typings for all GetVideoData helpers
- Fixed an inaccuracy due to which milliseconds were incorrectly converted to a string in `convertToStrTime` function ([vot-cli#37](https://github.com/FOSWLY/vot-cli/pull/37#discussion_r1694870105))
- Fixed VTT timestamp delimiter
- Added new subtitles convert directions:

  - `SRT -> JSON`;
  - `SRT -> VTT`;
  - `VTT -> JSON`;
  - `VTT -> SRT`;

- Renamed function `convertToSrtTimeFormat` -> `convertToStrTime`
- Fix a typo that turned `SubtitlesData` into `SubtitlesDate`

# 1.1.0

- Added Odysee support
- Added Coursehunter support
- Fix EpicGames 3 and 5 symbols ids
- Rework VideoHelper logic

Now 1 helper = 1 file.

some GetVideoId service logic moved to helper file.

`/helpers/index.ts` - concat all helpers in one class.

# 1.0.5

- Added EpicGames support
- Added 9animetv support
- Fix embed Mail.ru videos
- Simplified logic for `/inbox/` and `/bk/` paths of Mail.ru videos

# 1.0.4

- Added support of `/inbox/` and `/bk/` paths for Mail.ru videos

# 1.0.3

- The behavior of the `data` field has been changed in case of a request error, now an error is written to it, if there is one
- Some default types of any have been replaced with unknown
- Removed extra console.log

# 1.0.2

- Added Reddit New & Reddit Old support
- Added more Peertube sites

# 1.0.1

- Added Poketube support

# 1.0.0

- Initial release
