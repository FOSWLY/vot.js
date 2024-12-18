import { GraphQL } from "@vot.js/shared/types/utils";

export type SentryRelease = {
  id: string;
};

export type VideoTranscriptDetails = {
  id: number;
  captions_source_url: string;
  language: string;
  __typename: "VideoTranscriptDetails";
};

export type GenericError = {
  message: string;
  __typename: "GenericError";
};

export type VideoTranscriptData = Record<
  "fetchVideoTranscript",
  VideoTranscriptDetails | GenericError
>;

export type VideoTranscript = GraphQL<VideoTranscriptData>;
