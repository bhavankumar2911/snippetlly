import User from "./User";
import Project from "./Project";
import RefreshToken from "./RefreshToken";

User.belongsToMany(Project, { through: "UserProject" });
Project.belongsToMany(User, { through: "UserProject" });

export default {
  User,
  Project,
  RefreshToken,
};
