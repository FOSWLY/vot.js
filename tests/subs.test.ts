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
00:00:34,649 --> 00:00:38,469
we're back in tokyo checking out the carrot tower.`;

test("Convert to SRT", () => {
  const srt = convertSubs(jsonSubs, "srt");
  expect(srt).toEqual(srtSubs);
});

const vttSubs = `WEBVTT

00:00:26,170 --> 00:00:27,350
what'd you get there?

00:00:34,649 --> 00:00:38,469
we're back in tokyo checking out the carrot tower.`;

test("Convert to VTT", () => {
  const srt = convertSubs(jsonSubs, "vtt");
  expect(srt).toEqual(vttSubs);
});
