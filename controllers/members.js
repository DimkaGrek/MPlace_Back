import ApiError from "../exceptions/ApiError.js";
import Member from "../models/Member/Member.js";
import MemberService from "../services/MemberService.js";

export const getMemberByIdHandler = async (req, res, next) => {
    try {
        const memberId = req.params.memberId;
        const memberData = await MemberService.getMemberById(memberId);

        return res.status(200).json(memberData);
    } catch (error) {
        next(error);
    }
};

export const addMemberRoleHandler = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            throw ApiError.BadRequest("No name");
        }
        const role = await MemberService.addMemberRole(name);

        return res.status(201).json(role);
    } catch (error) {
        next(error);
    }
};

export const getMemberAllRolesHandler = async (req, res, next) => {
    try {
        const roles = await MemberService.getAllRoles();

        return res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};

export const addMemberSkillHandler = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            throw ApiError.BadRequest("No name");
        }
        const skill = await MemberService.addMemberSkill(name);

        return res.status(201).json(skill);
    } catch (error) {
        next(error);
    }
};
export const getMemberAllSkillsHandler = async (req, res, next) => {
    try {
        const skills = await MemberService.getAllSkills();

        return res.status(200).json(skills);
    } catch (error) {
        next(error);
    }
};

// export const addMemberRoleHandler = async (req, res, next) => {
//     try {
//         const memberId = req.params.memberId;
//         const { description } = req.body;
//         const role = await MemberService.addMemberRole(memberId, description);

//         return res.status(201).json(role);
//     } catch (error) {
//         next(error);
//     }
// };
