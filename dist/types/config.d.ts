import { LoggerLevel } from "./logger.js";
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
//# sourceMappingURL=config.d.ts.map