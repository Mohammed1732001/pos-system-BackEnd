import { Router } from "express";
import { auth, authAdmin ,  verifyToken} from "../../middleWare/autorization.js"
import * as dashpordController from "./controller/dashpord.js"
const router = Router();


router.get("/", verifyToken ,auth, authAdmin, dashpordController.getAdminDashboard)




export default router