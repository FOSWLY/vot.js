import config from "../config/config";
import { LoggerLevel } from "../types/logger";

export default class Logger {
  protected static readonly prefix = `[vot.js v${config.version}]`;
  static canLog(level: LoggerLevel) {
    return config.loggerLevel <= level;
  }

  static log(...messages: unknown[]) {
    if (!Logger.canLog(LoggerLevel.DEBUG)) {
      return;
    }

    console.log(Logger.prefix, ...messages);
  }

  static info(...messages: unknown[]) {
    if (!Logger.canLog(LoggerLevel.INFO)) {
      return;
    }

    console.info(Logger.prefix, ...messages);
  }

  static warn(...messages: unknown[]) {
    if (!Logger.canLog(LoggerLevel.WARN)) {
      return;
    }

    console.warn(Logger.prefix, ...messages);
  }

  static error(...messages: unknown[]) {
    if (!Logger.canLog(LoggerLevel.ERROR)) {
      return;
    }

    console.error(Logger.prefix, ...messages);
  }
}
