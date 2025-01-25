// Summary for summarization and neuroedit, Ya-Summary for neuroapi
export type SecType = "Vtrans" | "Vsubs" | "Summary" | "Ya-Summary";
export type HashName = "SHA-256" | "SHA-1";
export type SessionModule =
  | "video-translation"
  | "summarization"
  | "neuroapi"
  | "neuroedit";

export type ClientSession = {
  expires: number; // seconds lifetime from response (e.g. 3600)
  timestamp: number; // received in time (unix seconds)
  uuid: string;
  secretKey: string;
};
