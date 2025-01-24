# 2.2.0 [WIP]

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
