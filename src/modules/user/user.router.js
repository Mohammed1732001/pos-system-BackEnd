import { Router } from "express";
import * as userController from "./controller/user.js"
import { auth, authAdmin, verifyToken } from "../../middleWare/autorization.js";

const router = Router();


router.get("/", verifyToken, auth, authAdmin, userController.getAllUser)
router.patch("/", verifyToken, auth, userController.updateOwnUser)
router.get("/:id", verifyToken, auth, userController.getUser)

// admin

router.patch("/:id", verifyToken, auth, authAdmin, userController.updateAnyUser)
router.delete("/:id", verifyToken, auth, authAdmin, userController.deleteUser)







export default router

