export type PlayerData = {
  video_id: string;
};

export type PlayerElement = Element & {
  getVideoData?: () => PlayerData;
};
