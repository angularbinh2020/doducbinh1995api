export const DB_CONNECTION = {
  host: "sql6.freemysqlhosting.net",
  user: "sql6584150",
  password: "XDvQTUvAEu",
  database: "sql6584150",
  port: 3306,
};

export const TABLES = {
  ROLE: {
    name: "Role",
    fields: {
      id: "Id",
      roleName: "RoleName",
      roleCode: "RoleCode",
    },
  },
};

export const DB_QUERY = {
  CREATE_ROLE_TABLE: `CREATE TABLE IF NOT EXISTS Role (
    Id varchar(255) NOT NULL PRIMARY KEY,
    RoleName varchar(255) NOT NULL,
    RoleCode varchar(255) NOT NULL UNIQUE
);`,
  INSERT_ROW_INTO_ROLE_TABLE: `INSERT INTO Role (Id, RoleName, RoleCode) VALUES ?`,
  COUNT_ROLE_TABLE_RECORD: "SELECT COUNT(*) FROM Role;",
};
