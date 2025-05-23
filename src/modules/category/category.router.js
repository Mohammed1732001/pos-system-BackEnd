import { Router } from "express";

import * as categoryController from "./controller/category.js"
import { auth, authAdmin, verifyToken } from "../../middleWare/autorization.js";

const router = Router();

router.get("/", verifyToken, auth, categoryController.getCategory)
router.post("/", verifyToken, auth, authAdmin, categoryController.addCategory)
router.patch("/:id", verifyToken, auth, authAdmin, categoryController.updateCategory)
router.delete("/:id", verifyToken, auth, authAdmin, categoryController.deleteCategory)



export default router