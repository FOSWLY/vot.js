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

export type SecPrefix = "Sec" | "X";
export type USecYaHeader<T extends SecType, Y extends SecPrefix> =
  | `${Y}-${T}-Sk`
  | `${Y}-${T}-Token`;

export type SecYaHeader<T extends SecType> =
  | `${T}-Signature`
  | USecYaHeader<T, "Sec">;

export type USecYaHeaderMap<T extends SecType> = {
  [K in T]: K extends "Ya-Summary" ? USecYaHeader<T, "X"> : SecYaHeader<T>;
};

export type SecYaHeaders<T extends SecType> = Record<
  USecYaHeaderMap<T>[T],
  string
>;
