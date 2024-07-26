import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";

class Author extends Model {}

Author.init(
    {
        authorId: {
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
        modelName: "Author",
    }
);
export default Author;
