# AGENTS.md

## Commands

- Use Bun (`bun.lock` is the root lockfile): `bun install`.
- Run all tests with `bun test`; run one file with `bun test tests/subs.test.ts`.
- `tests/subs.test.ts` is local and fast; `tests/client.test.ts` calls live Yandex/VOT and worker endpoints; `tests/videoData.test.ts` may call third-party sites and honors `HTTP_PROXY`/`HTTPS_PROXY`.
- There is no useful root typecheck: `tsconfig.json` lacks DOM libs for extension code and includes scratch `test-scripts`. Typecheck per package instead: `bunx tsc --project packages/<shared|core|node|ext>/tsconfig.json --noEmit`.
- `bun lint` runs Biome over all `./packages`, not just touched files. Prefer focused Biome on changed files unless a repo-wide check is intended.
- Focused Biome fix command matching the pre-commit hook: `npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true <files>`.
- Do not run `bun format` casually: it is `biome check --unsafe --write ./packages` and can rewrite many unrelated files.

## Build And Generated Files

- `bun build:skip-proto` is the safer compile path when `protoc` is unavailable; `bun build:bun` regenerates protobuf and requires `protoc`.
- `scripts/build.ts` always runs `bun update:config`, which fetches Yandex version data and rewrites `packages/shared/src/data/config.ts`.
- `packages/shared/src/data/config.ts` is generated; keep durable comments or generation logic in `scripts/update-config.ts`.
- Protobuf source is `packages/shared/src/protos/yandex.proto`; generated TS under `packages/shared/src/protos/` is excluded from Biome.
- Builds remove each package `dist`, sync package versions from the root `package.json`, compile with `tsc`, run `tsc-esm-fix`, and generate `dist/typebox` from `src/types`.
- Root `build:doc`/`build:all` expect `.config/typedoc.json`; package Typedoc configs extend `.config/typedoc.base.json`, but `.config` is absent in this checkout.

## Package Map

- Workspace packages are only `packages/*`; `examples/` has its own manifest/lockfile and no scripts.
- `@vot.js/shared`: config, constants, alternative URL lists, protobuf exports, shared types, subtitle/logger/utils.
- `@vot.js/core`: core VOT clients, protobuf wrappers, core service enum/types; it intentionally has no real site detection (`src/data/sites.ts` is empty).
- `@vot.js/node`: runtime package; extends core clients with Undici `VOTAgent`; URL service matching is in `src/data/sites.ts`, normalization in `src/utils/videoData.ts`, extraction helpers in `src/helpers/`.
- `@vot.js/ext`: browser-extension package; extends core clients with browser security headers; uses DOM/window-based matching, selectors, players, and extra extension-only services in `ExtVideoService`.

## Service Changes

- For a new shared service, update `packages/core/src/types/service.ts`, matching rules in node/ext `src/data/sites.ts`, helper registration in node/ext `src/helpers/index.ts`, and `tests/videoData.test.ts` coverage.
- For extension-only services, use `packages/ext/src/types/service.ts` `ExtVideoService` and ext-only sites/helpers.
- Keep node and ext implementations aligned when both support the same site, but ext helpers often need DOM selectors/player logic while node helpers fetch or parse URLs directly.
- Site match rules accept `RegExp`, string includes, or `(URL) => boolean`; path-sensitive matching should use the function form.

## Release Mutations

- Package `prepack` scripts replace internal `workspace:^` dependency ranges with `^<root version>`; `postpublish` switches them back to `workspace:^`.
- Version changes should start at root `package.json`; build scripts propagate the root version into package manifests.
