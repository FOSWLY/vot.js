## vot.js contributing guide

### Packages

1. Don't upgrade `ts-proto` library to 2.x version. In 2.x `protobufjs` changed to `@bufbuild/protobuf`!

### Changing async for sepcific method in helpers

Adding/removing async for one specific method in helpers is not allowed. Either you change it in all packages at once, or you don't change it at all. This is done for greater consistency between different versions of the package.
