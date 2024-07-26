import express from "express";
import rootRouter from "./root.js";
import userRouter from "./users.js";
import messengerRouter from "./messengers.js";
import memberRouter from "./members.js";

const apiPrefix = "/api/v1";

const router = express.Router();

router.use(apiPrefix + "/users", userRouter);
router.use(apiPrefix + "/messengers", messengerRouter);
router.use(apiPrefix + "/members/", memberRouter);

router.get("/", rootRouter);

export default router;
