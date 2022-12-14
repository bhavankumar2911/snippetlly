import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { BelongsToManyGetAssociationsMixin } from "sequelize";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import connection from "../database/connection";
import Snippet from "./Snippet";
import User from "./User";

class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare authorId: string;
  declare isPublic: boolean;

  declare addUser: BelongsToManyAddAssociationMixin<User, string>;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare getSnippets: HasManyGetAssociationsMixin<Snippet>;
  declare removeUser: BelongsToManyRemoveAssociationMixin<User, string>;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    authorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { sequelize: connection }
);

export default Project;
