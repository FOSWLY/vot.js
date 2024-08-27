import { test, expect } from "bun:test";

import { convertSubs } from "../src/utils/subs";

const jsonSubs = {
  containsTokens: true,
  subtitles: [
    {
      text: "what'd you get there?",
      startMs: 26170,
      durationMs: 1180,
      tokens: [
        {
          text: "what'd",
          startMs: 26170,
          durationMs: 430,
        },
        {
          text: "you",
          startMs: 26600,
          durationMs: 120,
        },
        {
          text: "get",
          startMs: 26720,
          durationMs: 200,
        },
        {
          text: "there",
          startMs: 26920,
          durationMs: 430,
        },
      ],
      speakerId: "0",
    },
    {
      text: "we're back in tokyo checking out the carrot tower.",
      startMs: 34650,
      durationMs: 3820,
      tokens: [
        {
          text: "we're",
          startMs: 34650,
          durationMs: 450,
        },
        {
          text: "back",
          startMs: 35100,
          durationMs: 160,
        },
        {
          text: "in",
          startMs: 35260,
          durationMs: 200,
        },
        {
          text: "tokyo",
          startMs: 35460,
          durationMs: 770,
        },
        {
          text: "checking",
          startMs: 36690,
          durationMs: 510,
        },
        {
          text: "out",
          startMs: 37200,
          durationMs: 100,
        },
        {
          text: "the",
          startMs: 37300,
          durationMs: 140,
        },
        {
          text: "carrot",
          startMs: 37440,
          durationMs: 420,
        },
        {
          text: "tower",
          startMs: 37860,
          durationMs: 610,
        },
      ],
      speakerId: "1",
    },
  ],
};

const srtSubs = `1
00:00:26,170 --> 00:00:27,350
what'd you get there?

2
00:00:34,650 --> 00:00:38,470
we're back in tokyo checking out the carrot tower.`;

const vttSubs = `WEBVTT

00:00:26.170 --> 00:00:27.350
what'd you get there?

00:00:34.650 --> 00:00:38.470
we're back in tokyo checking out the carrot tower.`;

const jsonSubsWithoutTokens = {
  containsTokens: false,
  subtitles: [
    {
      text: "у вас были существующие системы ранжирования и подтверждения доверия. Если что-то публикуется на новостном сайте,",
      startMs: 361120,
      durationMs: 5259,
      speakerId: "0",
    },
    {
      text: "скорее всего, это правда. Если что-то публикуется на Reddit, скорее всего, это человек, а не бот.",
      startMs: 366600,
      durationMs: 4479,
      speakerId: "0",
    },
    {
      text: "Если что-то получило много положительных отзывов, скорее всего, это хорошо, а не плохо. Поскольку искусственный интеллект начинает использоваться для создания",
      startMs: 371360,
      durationMs: 5099,
      speakerId: "0",
    },
    {
      text: "этот контент заполняет эти места, так как мы получаем все больше новостных статей, генерируемых чатом GPT,",
      startMs: 376460,
      durationMs: 5080,
      speakerId: "0",
    },
    {
      text: "поскольку мы получаем все больше ответов о переполнении стека, генерируемом открытыми моделями искусственного интеллекта, поскольку эти источники",
      startMs: 381580,
      durationMs: 5259,
      speakerId: "0",
    },
  ],
};

const vttSubs2 = `WEBVTT

00:06:01.120 --> 00:06:06.379
у вас были существующие системы ранжирования и подтверждения доверия. Если что-то публикуется на новостном сайте,

00:06:06.600 --> 00:06:11.079
скорее всего, это правда. Если что-то публикуется на Reddit, скорее всего, это человек, а не бот.

00:06:11.360 --> 00:06:16.459
Если что-то получило много положительных отзывов, скорее всего, это хорошо, а не плохо. Поскольку искусственный интеллект начинает использоваться для создания

00:06:16.460 --> 00:06:21.540
этот контент заполняет эти места, так как мы получаем все больше новостных статей, генерируемых чатом GPT,

00:06:21.580 --> 00:06:26.839
поскольку мы получаем все больше ответов о переполнении стека, генерируемом открытыми моделями искусственного интеллекта, поскольку эти источники`;

const srtSubs2 = `1
00:06:01,120 --> 00:06:06,379
у вас были существующие системы ранжирования и подтверждения доверия. Если что-то публикуется на новостном сайте,

2
00:06:06,600 --> 00:06:11,079
скорее всего, это правда. Если что-то публикуется на Reddit, скорее всего, это человек, а не бот.

3
00:06:11,360 --> 00:06:16,459
Если что-то получило много положительных отзывов, скорее всего, это хорошо, а не плохо. Поскольку искусственный интеллект начинает использоваться для создания

4
00:06:16,460 --> 00:06:21,540
этот контент заполняет эти места, так как мы получаем все больше новостных статей, генерируемых чатом GPT,

5
00:06:21,580 --> 00:06:26,839
поскольку мы получаем все больше ответов о переполнении стека, генерируемом открытыми моделями искусственного интеллекта, поскольку эти источники`;

const vttSubsMultiLine = `WEBVTT

00:00:00.000 --> 00:00:01.415


00:00:01.415 --> 00:00:02.608
MATHEW WADSTEIN:
Now that we are prepared to`;

const srtSubsMultiLine = `1
00:00:00,000 --> 00:00:01,415


2
00:00:01,415 --> 00:00:02,608
MATHEW WADSTEIN:
Now that we are prepared to`;

const cursedVTT = `WEBVTT

04:00.970 --> 04:04.430 align:middle line:90%
m 6 15 l 256 14 250 284 12 283 16 25

04:00.970 --> 04:04.430
<b>Selezioni per l'All Japan

Quando: il 15 a mezzogiorno

Cosa si farà: tumbling, stunt, danza

Possono partecipare tutti gli anni

Non ci saranno allenamenti regolari
fino alle selezioni.
Potrete allenarvi per conto vostro
nella palestra 1.
Non dimenticate di fare
riscaldamento e stretching
e di riordinare quando avete finito.

Non battete la fiacca

Siate belle e zelanti</b>

04:06.750 --> 04:08.760
Ieri è stato incredibile, vero?`;

const srtMultilineWithParagraphs = `1
00:04:00,970 --> 00:04:04,430
m 6 15 l 256 14 250 284 12 283 16 25

2
00:04:00,970 --> 00:04:04,430
<b>Selezioni per l'All Japan

Quando: il 15 a mezzogiorno

Cosa si farà: tumbling, stunt, danza

Possono partecipare tutti gli anni

Non ci saranno allenamenti regolari
fino alle selezioni.
Potrete allenarvi per conto vostro
nella palestra 1.
Non dimenticate di fare
riscaldamento e stretching
e di riordinare quando avete finito.

Non battete la fiacca

Siate belle e zelanti</b>

3
00:04:06,750 --> 00:04:08,760
Ieri è stato incredibile, vero?`;

test("Convert JSON (with tokens) -> SRT", () => {
  const subs = convertSubs(jsonSubs, "srt");
  expect(subs).toEqual(srtSubs);
});

test("Convert JSON (with tokens) -> VTT", () => {
  const subs = convertSubs(jsonSubs, "vtt");
  expect(subs).toEqual(vttSubs);
});

test("Convert JSON -> VTT", () => {
  const subs = convertSubs(jsonSubsWithoutTokens, "vtt");
  expect(subs).toEqual(vttSubs2);
});

test("Convert VTT -> JSON", () => {
  const json = convertSubs(vttSubs2, "json");
  expect(json).toEqual(jsonSubsWithoutTokens);
});

test("Convert SRT -> JSON", () => {
  const subs = convertSubs(srtSubs2, "json");
  expect(subs).toEqual(jsonSubsWithoutTokens);
});

test("Convert VTT -> SRT", () => {
  const subs = convertSubs(vttSubs2, "srt");
  expect(subs).toEqual(srtSubs2);
});

test("Convert VTT (multi-line) -> SRT", () => {
  const subs = convertSubs(vttSubsMultiLine, "srt") as string;
  expect(subs).toEqual(srtSubsMultiLine);
});

test("Convert VTT (multi-line with paragraphs + with short timestamp format) -> SRT", () => {
  const subs = convertSubs(cursedVTT, "srt") as string;
  expect(subs).toEqual(srtMultilineWithParagraphs);
});
