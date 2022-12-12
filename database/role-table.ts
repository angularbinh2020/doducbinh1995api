import { DB_QUERY } from "../configs/database";
import logger from "../services/logger";
import { dbQuery } from "../services/database";
import { v4 as uuidv4 } from "uuid";
import { ROLE_CODE } from "../configs/role";

export const createRoleTable = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await dbQuery(DB_QUERY.CREATE_ROLE_TABLE);
      const countRoleTableRows = await dbQuery(
        DB_QUERY.COUNT_ROLE_TABLE_RECORD
      );
      if (countRoleTableRows.results[0]["COUNT(*)"]) {
        resolve(null);
        return;
      }
      const roleData = [
        [uuidv4(), `User`, ROLE_CODE.USER],
        [uuidv4(), `Admin`, ROLE_CODE.ADMIN],
      ];
      await dbQuery(DB_QUERY.INSERT_ROW_INTO_ROLE_TABLE, roleData);
      resolve(null);
    } catch (e) {
      logger.error("Create role table fail");
      logger.error(e);
      reject(e);
    }
  });
};
