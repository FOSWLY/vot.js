# vot.js

[![GitHub Actions](https://github.com/FOSWLY/vot.js/actions/workflows/build.yml/badge.svg)](https://github.com/FOSWLY/vot.js/actions/workflows/build.yml)
[![npm](https://img.shields.io/bundlejs/size/@vot.js/core)](https://www.npmjs.com/package/@vot.js/core)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)

An unofficial library for interacting with the Yandex VOT API, which supports working with JavaScript, TypeScript, and also has built-in parted types for Typebox.

The library supports working with [worker servers](https://github.com/FOSWLY/vot-worker), to do this, you need to create a `VOTWorkerClient` client and specify the domain of the worker server, for example `vot-worker.toil.cc`.

## Installation

To work with Node, Bun, or other runtimes, install the `@vot.js/node`:

```bash
bin install @vot.js/node
```

To develop browser extensions, install the `@vot.js/ext`:

```bash
bin install @vot.js/ext
```

If you only need part of the functionality, use the `@vot.js/core` and `@vot.js/shared`

## Getting started

To start working with the API, you need to create a VOT Client. This can be done using the line provided below.

Standard Client:

```ts
const client = new VOTClient();

const videoData = await client.getVideoData("https://youtu.be/LK6nLR1bzpI");

const result = await client.translateVideo({ videoData });
```

Proxying via [vot-worker](https://github.com/FOSWLY/vot-worker):

```ts
const client = new VOTWorkerClient({
  host: "vot.toil.cc",
});
```

You can see more code examples [here](https://github.com/FOSWLY/vot.js/tree/main/examples)

## Limitations

1. The library can't translate videos longer than 4 hours

## Build

To build, you must have:

- [Bun](https://bun.sh/)
- [Protoc](https://github.com/protocolbuffers/protobuf/releases) (if you are building with the update of the `.proto` file)

Don't forget to install the dependencies:

```bash
bun install
```

Start building:

```bash
bun build:all
```

## Tests

The library has minimal test coverage to check its performance.

Run the tests:

```bash
bun test
```
