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
import { VOTWorkerClient } from "@vot.js/ext";

const client = new VOTWorkerClient({
  host: "vot.toil.cc",
});
```

You can see more code examples [here](https://github.com/FOSWLY/vot.js/tree/main/examples)

## Install

To install:

```bash
bun install @vot.js/ext
```
