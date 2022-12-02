import connection from "../database/connection";
import {
  ModelAttributes,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

const { STRING, UUID, UUIDV4, TEXT } = DataTypes;

const attributes: ModelAttributes = {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: STRING,
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

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare username: string;
  declare email: string;
  declare password: string;
}

User.init(attributes, { sequelize: connection });

export default User;
