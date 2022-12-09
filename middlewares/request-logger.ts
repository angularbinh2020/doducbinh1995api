import GLOBAL_CONFIG from "../configs/global-config";
import fs from "fs";
import winston from "winston";
import path from "path";
import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "../const/date-time-format";

const logsFolder = path.join(...GLOBAL_CONFIG.logFilesFolder);
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "request.log",
      maxsize: GLOBAL_CONFIG.logFileSize,
      dirname: logsFolder,
      maxFiles: 1,
    }),
  ],
});

const requestLogger = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logMessage = ` [${dayjs().format(DATE_TIME_FORMAT.FULL_TIME)}] [${
    req.method
  }] : '${req.url}' (${res.statusCode})`;
  logger.info(logMessage);
  next();
};

export default requestLogger;
