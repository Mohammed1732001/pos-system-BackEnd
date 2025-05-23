import { Router } from "express";
import * as productController from "./controller/product.js"
import { fileUpload, fileValidation } from "../../utils/cloudnairyMulter.js"
import { auth, authAdmin, verifyToken } from "../../middleWare/autorization.js";


const router = Router();

router.get("/", verifyToken, auth, productController.getProduct)
router.patch("/:id", verifyToken, auth, authAdmin, productController.updateProduct)
router.post("/",verifyToken,auth,authAdmin,fileUpload(fileValidation.image).single("image"),productController.addProduct);
router.delete("/:id", verifyToken, auth, authAdmin, productController.deleteProduct)
router.get("/:id", verifyToken, auth, productController.getProductWithCategory)
router.get("/one/:id", verifyToken, auth, productController.getOneProduct)



export default router


