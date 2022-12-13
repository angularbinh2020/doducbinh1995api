export const DB_CONNECTION = {
  host: "sql6.freemysqlhosting.net",
  user: "sql6584150",
  password: "XDvQTUvAEu",
  database: "sql6584150",
  port: 3306,
};

export const TABLES = {
  ROLE: {
    name: "role",
    fields: {
      id: "id",
      roleName: "role_name",
      roleCode: "role_code",
    },
  },
  USER: {
    name: "user",
    fields: {
      id: "id",
      email: "email",
      phone: "phone",
      password: "password",
      role: "role",
    },
  },
};

export const DB_QUERY = {
  CREATE_ROLE_TABLE: `CREATE TABLE IF NOT EXISTS role (
    id varchar(255) NOT NULL PRIMARY KEY,
    role_name varchar(255) NOT NULL,
    role_code varchar(255) NOT NULL UNIQUE
);`,
  INSERT_ROW_INTO_ROLE_TABLE: `INSERT INTO role (id, role_name, role_code) VALUES ?`,
  COUNT_ROLE_TABLE_RECORD: "SELECT COUNT(*) FROM role;",
  CREATE_USER_TABLE: `CREATE TABLE IF NOT EXISTS user (
    id varchar(255) NOT NULL PRIMARY KEY,
    email varchar(255) UNIQUE,
    phone varchar(255) UNIQUE,
    password varchar(255) NOT NULL,
    role varchar(255) NOT NULL,
    foreign key (role) references role(id)
);`,
};
