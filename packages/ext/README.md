# @vot.js/ext

Web extensions support package for vot.js. Includes:

- additional support of Udemy and Coursera
- rewrited part of helpers for better perfomance and compatibility with DOM API

## Usage

```ts
import VOTClient from "@vot.js/ext";
import { getVideoData } from "@vot.js/ext/utils/videoData";

const client = new VOTClient();

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");

const result = await client.translateVideo({ videoData });
```

Proxying via [vot-worker](https://github.com/FOSWLY/vot-worker):

```ts
import { VOTClient } from "@vot.js/ext";
import { VOTNextWorkerProvider } from "@vot.js/core/providers/votworker";

const client = new VOTClient({
  host: "vot-worker.toil.cc",
  provider: VOTNextWorkerProvider,
});
```

You can see more code examples [here](https://github.com/FOSWLY/vot.js/tree/main/examples)

## Kinopoisk trailers

The extension helper supports unencrypted public trailers on
`kinopoisk.ru` / `www.kinopoisk.ru` and their
`frontend.vh.yandex.ru` iframe (with a Kinopoisk catalogue referrer).
Pass the active HTML video element in `{ video, fetchFn }` to
`getVideoID` and `getVideoData`. The fetch implementation must be able
to request the CDN playlists across origins and the player's CSP.

For MediaSource/blob playback, the helper reads resource timing entries
and matches their `vsid` to the enclosing `ya-video-player-*` element.
It declines ambiguous resources, gives a stable video ID independent of
CDN signatures/renditions, and returns the current signed media URL.
Signed URLs expire and must not be stored as permanent video links.
DRM/encrypted HLS, live playlists, DASH and subscription player pages
on `hd.kinopoisk.ru` are not supported.

`@vot.js/node` has no Kinopoisk helper: it cannot access the active
player's DOM or resource timings. Userscript integration also needs
matching frame permissions in the userscript metadata.

## Install

To install:

```bash
bun install @vot.js/ext
```
