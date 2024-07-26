import express from "express";
// import authMiddleware from "../middlewares/auth-middleware.js";

import {
    addMessengerHandler,
    getMessengerHandler,
} from "../controllers/messengers.js";

const router = express.Router();

router.post("", addMessengerHandler);
router.get("", getMessengerHandler);
export default router;
