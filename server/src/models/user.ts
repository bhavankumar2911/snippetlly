import connection from "../database/connection";
import { ModelAttributes, DataTypes } from "sequelize";

const { STRING, UUID, UUIDV4, TEXT } = DataTypes;

const attributes: ModelAttributes = {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: TEXT,
    allowNull: false,
  },
};

export default connection.define("User", attributes);
