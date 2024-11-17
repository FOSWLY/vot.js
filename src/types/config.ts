import { LoggerLevel } from "./logger";

export type ConfigSchema = {
  host: string;
  hostVOT: string;
  mediaProxy: string;
  userAgent: string;
  componentVersion: string;
  hmac: string;
  defaultDuration: number;
  minChunkSize: number;
  loggerLevel: LoggerLevel;
  version: string;
};
