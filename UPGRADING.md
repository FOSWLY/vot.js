## Upgrading from `v1.5.0` to `v2.0.0`

---

Version "2.0.0" includes splitting the library into several component parts for different runtimes. This will make it easier to integrate the library into different environments and reduce the need for manual patching of the library.

If you want to integrate a library for working with JavaScript runtime ([Node.js](https://nodejs.org/), [Bun.sh](https://bun.sh/) and etc). For example, when you make a console utility or a backend server. In this case, your choice will be `@vot.js/node`.

To install run:

```bash
bun install @vot.js/node
```

If you want to integrate the library to work in a browser extension (for example, [voice-over-translation](https://github.com/ilyhalight/voice-over-translation)). In this case, your choice will be `@vot.js/ext`.

> [!NOTE]
> In this version, getService returns an array of objects, not an object

To install run:

```bash
bun install @vot.js/ext
```

If you only need some general part of the code, then `@vot.js/shared` and `@vot.js/core` was created for you

To install run:

```bash
bun install @vot.js/shared @vot.js/core
```
