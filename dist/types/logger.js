export var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["DEBUG"] = 0] = "DEBUG";
    LoggerLevel[LoggerLevel["INFO"] = 1] = "INFO";
    LoggerLevel[LoggerLevel["WARN"] = 2] = "WARN";
    LoggerLevel[LoggerLevel["ERROR"] = 3] = "ERROR";
    LoggerLevel[LoggerLevel["SILENCE"] = 4] = "SILENCE";
})(LoggerLevel || (LoggerLevel = {}));
