import GLOBAL_CONFIG from "../configs/global-config";
import fs from "fs";
import winston from "winston";
import path from "path";

const logsFolder = path.join(...GLOBAL_CONFIG.logFilesFolder);
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs.log",
      maxsize: GLOBAL_CONFIG.logFileSize,
      dirname: logsFolder,
      maxFiles: 1,
    }),
  ],
});

export default logger;
