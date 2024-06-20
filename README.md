# vot.js

[![GitHub Actions](https://github.com/FOSWLY/vot.js/actions/workflows/ci.yml/badge.svg)](https://github.com/FOSWLY/vot.js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/bundlejs/size/vot.js)](https://www.npmjs.com/package/vot.js)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)

An unofficial library for interacting with the Yandex VOT API, which supports working with JavaScript, TypeScript, and also has built-in types for Typebox.

The library supports working with [worker servers](https://github.com/FOSWLY/vot-worker), to do this, you need to create a `VOTWorkerClient` client and specify the domain of the worker server, for example `vot-worker.toil.cc `.

## Installation

Installation for Bun:

```bash
bun add vot.js
```

Installation for NPM:

```bash
npm install vot.js
```

## Getting started

To start working with the API, you need to create a VOT Client. This can be done using the line provided below.

Standard Client:

```ts
const client = new VOTClient();
```

Proxying via [vot-worker](https://github.com/FOSWLY/vot-worker):

```ts
const client = new VOTWorkerClient({
  host: "vot.toil.cc",
});
```

You can see more code examples [here](https://github.com/FOSWLY/vot.js/examples)

## Limitations

1. The library can't translate videos longer than 4 hours
2. To translate udemy, coursera, coursehunter and other sites that have authorization, you must create your own handlers and translate only the link to the mp4 file to the library
3. For weverse, before translating, you must normalize the link yourself (use getVideoData from /utils/helpers.ts) and then pass the normalized link for translation. Otherwise, you will receive an infinity translation due to the fact that weverse returns a link with a random access key

## Build

To build, you must have:

- [Bun](https://bun.sh/)
- [Protoc](https://github.com/protocolbuffers/protobuf/releases) (if you are building with the update of the `.proto` file)

Don't forget to install the dependencies:

```bash
bun install
```

#### Build without updating .proto

This build option should be used in most cases if your changes do not affect the `.proto` file.

```bash
bun build:bun
```

#### Build with an update .proto

If you want to build the library by updating the proto files, then you need to install protoc 3+ and add it to the Path.

Linux (maybe on MacOS it will work too):

```bash
bun rebuild:linux
```

Windows:

```bash
bun rebuild:win
```

#### Building TypeScript types

You can use this build option if you only want to build types for TypeScript:

```bash
bun build:declaration
```

#### Building a TypeBox of Types

You can use this build option if you only want to build types for TypeBox:

```bash
bun build:typebox
```

#### Building only .proto file

You can use this build option if you only want to convert the `.proto` file to `.ts` (this will not update the file in the /dist folder):

Linux (maybe on MacOS it will work too):

```bash
bun build:proto-linux
```

Windows:

```bash
bun build:proto-win
```

## Tests

The library has minimal test coverage to check its performance.

Run the tests:

```bash
bun test
```
