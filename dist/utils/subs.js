function convertToSrtTimeFormat(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`;
}
export function convertSubs(data, output = "srt") {
    const subs = data.subtitles
        .map((sub, idx) => {
        const startTime = sub.startMs / 1000.0;
        const endTime = (sub.startMs + sub.durationMs) / 1000.0;
        const result = output === "srt" ? `${idx + 1}\n` : "";
        return (result +
            `${convertToSrtTimeFormat(startTime)} --> ${convertToSrtTimeFormat(endTime)}\n${sub.text}\n\n`);
    })
        .join("")
        .trim();
    return output === "vtt" ? `WEBVTT\n\n${subs}` : subs;
}
