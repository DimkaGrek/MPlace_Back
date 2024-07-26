import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class User extends Model {}

User.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(255),
        },
        sentNews: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        activationLink: {
            type: DataTypes.STRING,
        },
        restoreNumber: {
            type: DataTypes.STRING,
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        phone: {
            type: DataTypes.STRING(50),
        },
        socialToken: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

export default User;
