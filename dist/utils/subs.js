export function convertToStrTime(ms, delimiter = ",") {
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
function convertToMSTime(time) {
    const [strHours, strMinutes, strSeconds] = time.split(":");
    const secs = +strSeconds.replace(/[,.]/, "");
    const mins = +strMinutes * 60_000;
    const hours = +strHours * 3_600_000;
    return hours + mins + secs;
}
function convertSubsFromJSON(data, output = "srt") {
    const isVTT = output === "vtt";
    const delimiter = isVTT ? "." : ",";
    const subs = data.subtitles
        .map((sub, idx) => {
        const result = isVTT ? "" : `${idx + 1}\n`;
        return (result +
            `${convertToStrTime(sub.startMs, delimiter)} --> ${convertToStrTime(sub.startMs + sub.durationMs, delimiter)}\n${sub.text}\n\n`);
    })
        .join("")
        .trim();
    return isVTT ? `WEBVTT\n\n${subs}` : subs;
}
export function convertSubsToJSON(data, from = "srt") {
    const parts = data.split("\n\n");
    if (from === "vtt") {
        parts.shift();
    }
    const offset = +(from === "srt");
    const subtitles = parts.map((part) => {
        const lines = part.trim().split("\n");
        const time = lines[offset];
        const text = lines.slice(offset + 1).join("\n");
        const [start, end] = time.split(" --> ");
        const startMs = convertToMSTime(start);
        const endMs = convertToMSTime(end);
        const durationMs = endMs - startMs;
        return {
            text,
            startMs,
            durationMs,
            speakerId: "0",
        };
    });
    return {
        containsTokens: false,
        subtitles,
    };
}
export function getSubsFormat(data) {
    if (typeof data !== "string") {
        return "json";
    }
    if (data.startsWith("WEBVTT\n\n")) {
        return "vtt";
    }
    return "srt";
}
export function convertSubs(data, output = "srt") {
    const from = getSubsFormat(data);
    if (from === output)
        return data;
    if (from === "json") {
        return convertSubsFromJSON(data, output);
    }
    data = convertSubsToJSON(data, from);
    if (output === "json") {
        return data;
    }
    return convertSubsFromJSON(data, output);
}
