# vot.js

[![GitHub Actions](https://github.com/FOSWLY/vot.js/actions/workflows/ci.yml/badge.svg)](https://github.com/FOSWLY/vot.js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/bundlejs/size/vot.js)](https://www.npmjs.com/package/vot.js)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

Неофициальная библиотека для взаимодействия с Yandex VOT API, которая поддерживает работу с JavaScript, TypeScript, а так же имеет некоторые встроенные типы для Typebox.

Библиотека поддерживает работу с [воркер-серверами](https://github.com/FOSWLY/vot-worker), для этого необходимо создать клиент `VOTWorkerClient` и указать домен воркер-сервера, например `vot-worker.toil.cc`.

## Установка

Установка для Bun:

```bash
bun add vot.js
```

Установка для NPM:

```bash
npm install vot.js
```

## Начало работы

Для начала работы с API необходимо создать VOT Client. Это можно сделать с помощью пары строчек представленных ниже.

Стандартный клиент:

```ts
const client = new VOTClient();

const videoData = await client.getVideoData("https://youtu.be/LK6nLR1bzpI");

const result = await client.translateVideo({ videoData });
```

Проксирование через [vot-worker](https://github.com/FOSWLY/vot-worker):

```ts
const client = new VOTWorkerClient({
  host: "vot.toil.cc",
});
```

Больше примеров кода вы можете увидеть [здесь](https://github.com/FOSWLY/vot.js/tree/main/examples)

## Ограничения

1. Библиотека не может переводить видео длинной более 4 часов
2. Для перевода udemy, coursera, coursehunter и прочих сайтов, которые имеют авторизацию, вы должны создать свои собственные обработчики

## Сборка

Для сборки необходимо наличие:

- [Bun](https://bun.sh/)
- [Protoc](https://github.com/protocolbuffers/protobuf/releases) (если собираете с обновлением `.proto` файла)

Не забудьте установить зависимости:

```bash
bun install
```

#### Сборка без обновления .proto

Данным вариантом сборки, следует пользоваться в большинстве случаев, если ваши изменения не затрагивают `.proto` файл.

```bash
bun build:bun
```

#### Сборка с обновлением .proto

Если вы хотите собрать библиотеку, обновив proto файлы, то вам необходимо установить protoc 3+ и добавить его в Path.

Сборка из под Linux (возможно, на MacOS, тоже, сработает):

```bash
bun rebuild:linux
```

Сборка из под Windows:

```bash
bun rebuild:win
```

#### Сборка TypeScript типов

Вы можете воспользоваться данным вариантом сборки, если вы хотите собрать, только, типы для TypeScript:

```bash
bun build:declaration
```

#### Сборка TypeBox типов

Вы можете воспользоваться данным вариантом сборки, если вы хотите собрать, только, типы для TypeBox:

```bash
bun build:typebox
```

#### Сборка только .proto файла

Вы можете воспользоваться данным вариантом сборки, если вы хотите, только, преобразовать `.proto` файл в `.ts` (это не обновит файл в папке /dist):

Сборка из под Linux (возможно, на MacOS, тоже, сработает):

```bash
bun build:proto-linux
```

Сборка из под Windows:

```bash
bun build:proto-win
```

## Тесты

Библиотека имеет минимальное покрытие тестами для проверки ее работоспособности.

Запустить тесты:

```bash
bun test
```
