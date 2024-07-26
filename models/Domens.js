import { Model, DataTypes } from 'sequelize';
import sequelize from './database.js';


class Domens extends Model {}

Domens.init(
    {
        domensId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Domens',
    }
)
export default Domens;