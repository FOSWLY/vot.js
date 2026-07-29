import type { availableLangs, availableTTS } from "../data/consts";
import type { LoggerLevel } from "./logger";

export type ConfigSchema = {
  host: string;
  hostWorker: string;
  mediaProxy: string;
  userAgent: string;
  componentVersion: string;
  hmac: string;
  defaultDuration: number;
  minChunkSize: number;
  loggerLevel: LoggerLevel;
  version: string;
};

export type RequestHeaders = Record<string, string>;
export type RequestLang = (typeof availableLangs)[number];
export type ResponseLang = (typeof availableTTS)[number];
