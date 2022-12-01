import { config } from "dotenv";

const nodeEnv = process.env.NODE_ENV;

interface IDBConfig {
  dbName: undefined | string;
  dbUser: undefined | string;
  dbPassword: undefined | string;
  dbHost: undefined | string;
}

export let dbConfig: IDBConfig = {
  dbName: "",
  dbUser: "",
  dbPassword: "",
  dbHost: "",
};

if (nodeEnv == "development") {
  config();

  dbConfig.dbName = process.env.DEV_DB;
  dbConfig.dbUser = process.env.DEV_DB_USER;
  dbConfig.dbPassword = process.env.DEV_DB_PASSWORD;
  dbConfig.dbHost = process.env.DEV_DB_HOST;
}
