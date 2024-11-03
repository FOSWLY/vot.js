import config from "../config/config.js";
import { LoggerLevel } from "../types/logger.js";
export default class Logger {
    static prefix = `[vot.js v${config.version}]`;
    static canLog(level) {
        return config.loggerLevel <= level;
    }
    static log(...messages) {
        if (!Logger.canLog(LoggerLevel.DEBUG)) {
            return;
        }
        console.log(Logger.prefix, ...messages);
    }
    static info(...messages) {
        if (!Logger.canLog(LoggerLevel.INFO)) {
            return;
        }
        console.info(Logger.prefix, ...messages);
    }
    static warn(...messages) {
        if (!Logger.canLog(LoggerLevel.WARN)) {
            return;
        }
        console.warn(Logger.prefix, ...messages);
    }
    static error(...messages) {
        if (!Logger.canLog(LoggerLevel.ERROR)) {
            return;
        }
        console.error(Logger.prefix, ...messages);
    }
}
