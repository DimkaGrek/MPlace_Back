import ApiError from "../exceptions/ApiError.js";
import Member from "../models/Member/Member.js";
import Role from "../models/Member/Role.js";
import Skills from "../models/Member/Skills.js";

const getMemberById = async (memberId) => {
    const member = await Member.findByPk(memberId);
    if (!member) {
        throw ApiError.NotFound("Member not found");
    }
    return member;
};

const addMemberRole = async (name) => {
    const newRole = await Role.create({
        name,
    });

    return newRole;
};

const getAllRoles = async () => {
    const listRoles = await Role.findAll();

    return listRoles;
};

const addMemberSkill = async (name) => {
    const newSkill = await Skills.create({
        name,
    });

    return newSkill;
};

const getAllSkills = async () => {
    const listSkills = await Skills.findAll();

    return listSkills;
};

export default {
    getMemberById,
    addMemberRole,
    getAllRoles,
    addMemberSkill,
    getAllSkills,
};
