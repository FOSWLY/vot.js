export type SecType = "Vtrans" | "Vsubs" | "Summary";
export type HashName = "SHA-256" | "SHA-1";
export type SessionModule = "video-translation" | "summarization";

export type ClientSession = {
  expires: number; // seconds lifetime from response (e.g. 3600)
  timestamp: number; // received in time (unix seconds)
  uuid: string;
  secretKey: string;
};
