import { SubtitleFormat, SubtitleItem, SubtitlesData } from "../types/subs";

export function convertToStrTime(ms: number, delimiter = ",") {
  const seconds = ms / 1000;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor(ms % 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}${delimiter}${milliseconds.toString().padStart(3, "0")}`;
}

function convertToMSTime(time: string) {
  const parts = time.split(" ")?.[0]?.split(":");
  if (parts.length < 3) {
    parts.unshift("00");
  }

  const [strHours, strMinutes, strSeconds] = parts;

  const secs = +strSeconds.replace(/[,.]/, "");
  const mins = +strMinutes * 60_000;
  const hours = +strHours * 3_600_000;
  return hours + mins + secs;
}

function convertSubsFromJSON(
  data: SubtitlesData,
  output: Exclude<SubtitleFormat, "json"> = "srt",
) {
  const isVTT = output === "vtt";
  const delimiter = isVTT ? "." : ",";
  const subs = data.subtitles
    .map((sub, idx) => {
      const result = isVTT ? "" : `${idx + 1}\n`;
      return (
        result +
        `${convertToStrTime(sub.startMs, delimiter)} --> ${convertToStrTime(
          sub.startMs + sub.durationMs,
          delimiter,
        )}\n${sub.text}\n\n`
      );
    })
    .join("")
    .trim();
  return isVTT ? `WEBVTT\n\n${subs}` : subs;
}

function convertSubsToJSON(
  data: string,
  from: Exclude<SubtitleFormat, "json"> = "srt",
): SubtitlesData {
  const parts = data.split(/\r?\n\r?\n/g);
  if (from === "vtt") {
    parts.shift();
  }

  const offset = +(from === "srt");
  const subtitles = parts.reduce((result, part) => {
    // for work with multi-line subs
    const lines = part.trim().split("\n");
    const time = lines[offset];
    const text = lines.slice(offset + 1).join("\n");
    if (
      (lines.length !== 2 || !part.includes(" --> ")) &&
      !time?.includes(" --> ")
    ) {
      // for work with multi-line paragraphs
      result[result.length - 1].text += `\n\n${lines.join("\n")}`;
      return result;
    }

    const [start, end] = time.split(" --> ");
    const startMs = convertToMSTime(start);
    const endMs = convertToMSTime(end);
    const durationMs = endMs - startMs;

    result.push({
      text,
      startMs,
      durationMs,
      speakerId: "0",
    });
    return result;
  }, [] as SubtitleItem[]);

  return {
    containsTokens: false,
    subtitles,
  };
}

export function getSubsFormat(data: SubtitlesData | string): SubtitleFormat {
  if (typeof data !== "string") {
    return "json";
  }

  if (/(WEBVTT)(\r?\n\r?\n)/.exec(data)) {
    return "vtt";
  }

  return "srt";
}

export function convertSubs(
  data: SubtitlesData | string,
  output: SubtitleFormat = "srt",
) {
  const from = getSubsFormat(data);
  if (from === output) return data;
  if (from === "json") {
    return convertSubsFromJSON(
      data as SubtitlesData,
      output as Exclude<SubtitleFormat, "json">,
    );
  }

  data = convertSubsToJSON(data as string, from);
  if (output === "json") {
    return data;
  }

  return convertSubsFromJSON(data, output);
}
