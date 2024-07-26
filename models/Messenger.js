import { Model, DataTypes } from "sequelize";
import sequelize from "./database.js";

class Messenger extends Model {}

Messenger.init(
    {
        MessengerId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Messenger",
    }
);

export default Messenger;
