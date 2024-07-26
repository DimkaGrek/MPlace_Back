import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Member extends Model {}

Member.init(
    {
        memberId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Member",
    }
);

export default Member;
