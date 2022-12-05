import { InferAttributes, Model, DataTypes } from "sequelize";
import connection from "../database/connection";

class RefreshToken extends Model<InferAttributes<RefreshToken>> {
  declare userId: string;
  declare token: string;
}

RefreshToken.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize: connection }
);

export default RefreshToken;
