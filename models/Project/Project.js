import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';

class Project extends Model {}

Project.init(
    {
        projectId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        shortDescription: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        authorId: {
            type: DataTypes.INTEGER,
        },
        dateDeadline: {
            type: DataTypes.DATE,
        },
        dateCreate: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.STRING,
        },
        link: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Project',
    }
);

export default Project;
