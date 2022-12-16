import { DB_CONNECTION } from "../configs/database";
import mysql from "mysql";
import logger from "./logger";
import { IDbQueryResult } from "../models/IDbQuery";

const connection = mysql.createConnection(DB_CONNECTION);

connection.connect(function (error, ...rest) {
  if (error) {
    logger.error("Database connection fail");
    logger.error(error);
    return;
  }
  logger.info("Database connected");
  logger.info(rest);
});

export function dbQuery(
  options: mysql.Query | string | mysql.QueryOptions,
  values?: any
): Promise<IDbQueryResult> {
  return new Promise((resolve, reject) => {
    if (values) {
      connection.query(options, [values], function (error, results, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          results,
          fields,
        });
      });
      return;
    }
    connection.query(options, function (error, results, fields) {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        results,
        fields,
      });
    });
  });
}
export default connection;
