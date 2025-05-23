import { Router } from "express";
import * as orderController from "./controller/order.js"
import {auth , authAdmin ,  verifyToken } from "../../middleWare/autorization.js";
const router= Router()


router.get("/open-order", verifyToken , auth , orderController.openOrder)
router.get("/:id", verifyToken ,auth , orderController.getOrder)
router.put("/transfer-order/:id", verifyToken ,auth , orderController.transeferOrder)
router.get("/", verifyToken, auth , orderController.getAllOrder)
router.delete("/:id", verifyToken, auth , authAdmin, orderController.deleteOrder)
router.put("/:id/add-item", verifyToken, auth , orderController.addItemToOrder)
router.patch("/:id/remove-item", verifyToken , auth , orderController.removeItemFromOrder)
router.patch("/:id/remove-item-completely", verifyToken , auth , orderController.removeItemCompletelyFromOrder)
router.post("/", verifyToken , auth , orderController.createOrder)


export default router