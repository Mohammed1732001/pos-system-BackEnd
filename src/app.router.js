import connectDB from "./DB/connection.js"
import userRouter from "./modules/user/user.router.js"
import productRouter from "./modules/product/product.router.js"
import { globalErrorHandler } from "./utils/errorHandling.js"
import authRouter from "./modules/auth/auth.router.js"
import categoryRouter from "./modules/category/category.router.js"
import tapleRouter from "./modules/taple/taple.router.js"
import orderRouter from "./modules/order/order.router.js"
import invoiceRouter from "./modules/invoice/invoice.router.js"
import dashpordRouter from "./modules/dashpord/dashpord.router.js"
const initApp = (app, express) => {
    app.use(express.json())

    app.use("/uploads", express.static("uploads"))

    app.get("/", (req, res, next) => {
        res.status(200).json({ message: "Hello from the backend" })
    })
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/product", productRouter)
    app.use("/category", categoryRouter)
    app.use("/taple", tapleRouter)
    app.use("/order", orderRouter)
    app.use("/invoice", invoiceRouter)
    app.use("/dashpord", dashpordRouter)

    app.all("*", (req, res) => {
        res.status(404).json({ message: "Route not found" })
    })

    // global error handler
    app.use(globalErrorHandler)

    // database connection
    connectDB()
}


export default initApp