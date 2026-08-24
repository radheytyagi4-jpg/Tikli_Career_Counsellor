import { Router } from "express";
import { userRegister, userLogin, userVerify, responseGenerater } from "../controllers/user.controller.js";
import { verify } from "../middlewares/user.middleware.js";

export const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/verify", userVerify);
router.post("/responseGenerater", verify, responseGenerater);