import { Router } from "express";
import * as authController from "./controller/auth.js"
import { auth , authAdmin, verifyToken } from "../../middleWare/autorization.js";

const router = Router();

router.post("/signup", authController.SignUp)
router.post("/login", authController.login)
router.delete("/logout", authController.logout)
router.post("/create-code", verifyToken ,auth, authAdmin, authController.createCode)
router.post("/Login-code", authController.loginWithCode)

export default router