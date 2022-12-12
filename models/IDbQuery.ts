import mysql from "mysql";

export interface IDbQueryResult {
  results?: any;
  fields?: mysql.FieldInfo[];
}