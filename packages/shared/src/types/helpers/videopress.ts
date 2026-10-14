export type VideoInfo = {
  file_url_base?: { https?: string; http?: string };
  files?: Record<string, { mp4?: string; hls?: string }>;
  original?: string;
};
