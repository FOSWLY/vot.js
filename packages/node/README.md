# @vot.js/node

JS Runtimes support package for vot.js

## Usage

```ts
import VOTClient from "@vot.js/node";
import { getVideoData } from "@vot.js/node/utils/videoData";

const client = new VOTClient();

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");

const result = await client.translateVideo({ videoData });
```

Proxying via [vot-worker](https://github.com/FOSWLY/vot-worker):

```ts
import { VOTClient } from "@vot.js/node";
import { VOTNextWorkerProvider } from "@vot.js/core/providers/votworker";

const client = new VOTClient({
  host: "vot-worker.toil.cc",
  provider: VOTNextWorkerProvider,
});
```

You can see more code examples [here](https://github.com/FOSWLY/vot.js/tree/main/examples)

## Install

To install:

```bash
bun install @vot.js/node
```
