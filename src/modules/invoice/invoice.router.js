import { Router } from "express";
import * as invoiceController from "./controller/invoice.js"
import { auth, authAdmin, verifyToken } from "../../middleWare/autorization.js";

const router = Router();

router.get("/", verifyToken, auth, invoiceController.getAllInvoice)
router.get("/:id", verifyToken, auth, invoiceController.getOneInvoice)
router.delete("/:id", auth, authAdmin, invoiceController.deleteInvoice)
router.put("/:id/pay-or-not", auth,  invoiceController.payedOrNot)
router.put("/:id/payment-method", auth,  invoiceController.paymentMethod)
router.get('/order/:orderId', auth,  invoiceController.getInvoiceByOrderId);



export default router

