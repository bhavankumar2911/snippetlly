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

interface ITokenConfig {
  accessTokenSecret: undefined | string;
  refreshTokenSecret: undefined | string;
}

export let TokenConfig: ITokenConfig = {
  accessTokenSecret: "",
  refreshTokenSecret: "",
};

if (nodeEnv == "development") {
  config();

  TokenConfig.accessTokenSecret = process.env.DEV_ACCESS_TOKEN_SECRET;
  TokenConfig.refreshTokenSecret = process.env.DEV_REFRESH_TOKEN_SECRET;
}
