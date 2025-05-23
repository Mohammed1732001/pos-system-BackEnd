import { Router } from "express";
import * as tapleController from "./controller/taple.js"
import { auth, authAdmin , verifyToken} from "../../middleWare/autorization.js";
const router = Router();


router.get("/", verifyToken, auth, tapleController.getTable)
router.patch("/:id", verifyToken, auth, tapleController.UpdateTable)
router.get("/allDitails", verifyToken, auth, authAdmin, tapleController.getAllTaplesWithDitails)
router.get("/allDitails/:id", verifyToken, auth, authAdmin, tapleController.getAllTapleOneWithDitails)
router.get("/:id", verifyToken, auth, tapleController.getTableById)
router.delete("/:id", verifyToken, auth, tapleController.deleteTable)
router.post("/", verifyToken, auth, authAdmin, tapleController.creatTable)
router.put("/reserve/:id", verifyToken, auth, tapleController.reserveTable)
router.put("/close/:id", verifyToken, auth, tapleController.closeOrderForTable)
router.post("/:id", verifyToken, auth, tapleController.createOrderforTable)
router.get("/invoice/:id", verifyToken, auth, tapleController.createInvoice)



export default router