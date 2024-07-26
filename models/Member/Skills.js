import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';


class Skills extends Model {}

Skills.init({
        skillsId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING
        }
},
{
    sequelize,
    modelName: 'Skills',
}
)

export default Skills;
