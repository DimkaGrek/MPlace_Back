import { Model, DataTypes } from 'sequelize';
import sequelize from './database.js';

class Token extends Model {}

Token.init(
    {
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Token',
    }
);

export default Token;
