import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';

class Module extends Model {}

Module.init(
    {
        moduleId: {
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
        modelName: 'Module',
    }
);
export default Module;
