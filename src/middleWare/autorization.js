import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/errorHandling.js"
import userModel from "../DB/models/user.model.js";
import blacklistedTokenModel from "../DB/models/blacklistedToken.js";


const verifyToken = asyncHandler(async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return next(new Error("Where is the token"))
    }
    const findTokenInDB = await blacklistedTokenModel.findOne({ token })
    if (findTokenInDB) {
        return next(new Error('Token has been blacklisted. Please log in again.'));
    }
    return next()

})

const auth = asyncHandler(async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return next(new Error("Token is required"))
    }
    const decoded = jwt.verify(token, process.env.SIGN_TOKEN)

    if (!decoded?.id || !decoded?.role) {
        return next(new Error("in valid token payRool"))
    }

    const authUser = await userModel.findById(decoded.id).select("_id email role")
    if (!authUser) {
        return next(new Error("Not Rigister Account"))
    }
    req.user = authUser
    return next()

})

const authAdmin = asyncHandler(async (req, res, next) => {
    const { role, id } = req.user
    const user = await userModel.findById(id)
    if (user.role !== 'admin') {
        return next(new Error("Not Admin"))
    }
    return next()
})

export { auth, authAdmin, verifyToken }