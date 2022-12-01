import { Sequelize } from "sequelize";
import { dbConfig } from "../config";

const connection = new Sequelize(
  dbConfig.dbName as string,
  dbConfig.dbUser as string,
  dbConfig.dbPassword as string,
  {
    dialect: "mysql",
    host: dbConfig.dbHost,
    logging: false,
  }
);

export default connection;
