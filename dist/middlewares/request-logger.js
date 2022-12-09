"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_config_1 = __importDefault(require("../configs/global-config"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const dayjs_1 = __importDefault(require("dayjs"));
const date_time_format_1 = require("../const/date-time-format");
const logsFolder = path_1.default.join(...global_config_1.default.logFilesFolder);
if (!fs_1.default.existsSync(logsFolder)) {
    fs_1.default.mkdirSync(logsFolder);
}
const logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: "request.log",
            maxsize: global_config_1.default.logFileSize,
            dirname: logsFolder,
            maxFiles: 1,
        }),
    ],
});
const requestLogger = function (req, res, next) {
    const logMessage = ` [${(0, dayjs_1.default)().format(date_time_format_1.DATE_TIME_FORMAT.FULL_TIME)}] [${req.method}] : '${req.url}' (${res.statusCode})`;
    logger.info(logMessage);
    next();
};
exports.default = requestLogger;
