import express from "express";

import {
    getMemberByIdHandler,
    addMemberRoleHandler,
    getMemberAllRolesHandler,
    addMemberSkillHandler,
    getMemberAllSkillsHandler,
} from "../controllers/members.js";

const router = express.Router();

router.post("/roles", addMemberRoleHandler);
router.get("/roles", getMemberAllRolesHandler);
router.post("/skills", addMemberSkillHandler);
router.get("/skills", getMemberAllSkillsHandler);

router.get("/:memberId", getMemberByIdHandler);

export default router;
