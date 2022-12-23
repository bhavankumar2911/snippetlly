import User from "./User";
import Project from "./Project";
import RefreshToken from "./RefreshToken";
import Snippet from "./Snippet";

// user-project
User.belongsToMany(Project, { through: "UserProject" });
Project.belongsToMany(User, { through: "UserProject" });

// project-snippet
Project.hasMany(Snippet);
Snippet.belongsTo(Project);

// snippet-user
User.hasMany(Snippet);
Snippet.belongsTo(User);

export default {
  User,
  Project,
  RefreshToken,
};
