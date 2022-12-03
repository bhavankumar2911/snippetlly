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
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: connection }
);

export default RefreshToken;
