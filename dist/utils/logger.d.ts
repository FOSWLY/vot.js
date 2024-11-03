import { LoggerLevel } from "../types/logger.js";
export default class Logger {
    protected static readonly prefix: string;
    static canLog(level: LoggerLevel): boolean;
    static log(...messages: unknown[]): void;
    static info(...messages: unknown[]): void;
    static warn(...messages: unknown[]): void;
    static error(...messages: unknown[]): void;
}
//# sourceMappingURL=logger.d.ts.map