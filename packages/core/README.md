# @vot.js/core

Core package for vot.js. It has only basic functions without receiving video data or defining a video service

## Usage

```ts
import VOTClient from "@vot.js/core";

const client = new VOTClient();

const videoData = ...;

const result = await client.translateVideo({ videoData });
```

Proxying via [vot-worker](https://github.com/FOSWLY/vot-worker):

```ts
import { VOTClient } from "@vot.js/core";
import { VOTNextWorkerProvider } from "@vot.js/core/providers/votworker";

const client = new VOTClient({
  host: "vot-worker.toil.cc",
  provider: VOTNextWorkerProvider,
});
```

You can see more code examples [here](https://github.com/FOSWLY/vot.js/tree/main/examples)

To install:

```bash
bun install @vot.js/core
```
