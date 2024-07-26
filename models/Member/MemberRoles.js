import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const MemberRoles = sequelize.define(
    'MemberRoles',
    {
        memberRolesId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        memberId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Member',
                key: 'id',
            },
        },
        roleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Role',
                key: 'id',
            },
        },
        experience: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'MemberRoles',
    }
);
export default MemberRoles;
