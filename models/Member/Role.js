import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';

class Role extends Model {}

Role.init(
    {
        roleId: {
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
        modelName: 'Role',
    }
);

export default Role;
