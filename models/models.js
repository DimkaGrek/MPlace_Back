import sequelize from "./database.js";

import Member from "./Member/Member.js";
import Role from "./Member/Role.js";
import MemberRoles from "./Member/MemberRoles.js";
import Skills from "./Member/Skills.js";

import Module from "./Project/Module.js";
import Project from "./Project/Project.js";

import Author from "./Users/Author.js";
import User from "./Users/User.js";
import Domens from "./Domens.js";

import Messengers from "./Messenger.js";
import Token from "./Token.js";

const UserDomen = sequelize.define("UserDomen", {});
Domens.belongsToMany(Member, { through: UserDomen });
Member.belongsToMany(Domens, { through: UserDomen });

const UserMessegers = sequelize.define("UserMessegers", {});
Messengers.belongsToMany(User, { through: UserMessegers });
User.belongsToMany(Messengers, { through: UserMessegers });

const MemberRolesSkills = sequelize.define("MemberRolesSkills", {});
Skills.belongsToMany(MemberRoles, { through: MemberRolesSkills });
MemberRoles.belongsToMany(Skills, { through: MemberRolesSkills });

const ProjectModules = sequelize.define("ProjectModules", {});
Module.belongsToMany(Project, { through: ProjectModules });
Project.belongsToMany(Module, { through: ProjectModules });

const ProjectDomens = sequelize.define("ProjectDomens", {});
Domens.belongsToMany(Project, { through: ProjectDomens });
Project.belongsToMany(Domens, { through: ProjectDomens });

User.hasOne(Member, { foreignKey: "userId" });
Member.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Author, { foreignKey: "userId" });
Author.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Token, { foreignKey: "userId" });
Token.belongsTo(User, { foreignKey: "userId" });

Member.belongsToMany(Role, {
    through: MemberRoles,
    foreignKey: "memberId",
    otherKey: "roleId",
});
Role.belongsToMany(Member, {
    through: MemberRoles,
    foreignKey: "roleId",
    otherKey: "memberId",
});

const initModels = async () => {
    try {
        await sequelize.sync({ alter: true }); // Это создаст или обновит таблицы в базе данных в соответствии с вашими моделями
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Error syncing models:", error);
    }
};

initModels();
