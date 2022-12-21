import { BelongsToGetAssociationMixin, ForeignKey } from "sequelize";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import connection from "../database/connection";
import Project from "./Project";

class Snippet extends Model<
  InferAttributes<Snippet>,
  InferCreationAttributes<Snippet>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare code: string;
  declare language: boolean;
  declare projectId: ForeignKey<Project["id"]>;

  declare getProject: BelongsToGetAssociationMixin<Project>;
}

Snippet.init(
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
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    language: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize: connection }
);

export default Snippet;
