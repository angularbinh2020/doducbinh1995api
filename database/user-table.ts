import { DB_QUERY } from "../configs/database";
import logger from "../services/logger";
import { dbQuery } from "../services/database";

export const createUserTable = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await dbQuery(DB_QUERY.CREATE_USER_TABLE);
      resolve(null);
    } catch (e) {
      logger.error("Create user table fail");
      logger.error(e);
      reject(e);
    }
  });
};
