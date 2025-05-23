import { asyncHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../DB/models/user.model.js";
import { compare, hash } from "../../../utils/hashAndCompare.js"
import jwt from "jsonwebtoken"
import blacklistedTokenModel from "../../../DB/models/blacklistedToken.js";
import loginCodeModel from "../../../DB/models/loginCode.js";

export const SignUp = asyncHandler(async (req, res, next) => {
    const { email, userName, password, confirmPassword, role, phone } = req.body
    const cheackUser = await userModel.findOne({ email })
    if (cheackUser) {
        return next(new Error("Email already exist"))
    }
    if (password != confirmPassword) {
        return next(new Error("Password and Confirm Password don't match"))
    }
    const hashPassword = hash({ plainText: password })
    const user = await userModel.create({ email, userName, password: hashPassword, role, phone })
    res.status(201).json({ message: "Done", user })
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("in valid-email "))
    }
    const isMatch = compare({ plainText: password, hashValue: user.password })
    if (!isMatch) {
        return next(new Error("in valid-password "))
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SIGN_TOKEN, { expiresIn: "1d" })
    res.status(200).json({ message: "Done", token })
})


export const logout = asyncHandler(async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return next(new Error("Token is required in logout"))
    }

    const blacklistedToken = await blacklistedTokenModel.create({ token })
    res.status(200).json({ message: "log out success" })

})


export const createCode = asyncHandler(async (req, res, next) => {
    const { token } = req.headers
    const { userId } = req.body
    const user = await userModel.findById(userId)
    if (!user) {
        return next(new Error("User not found"))
    }
    function generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    const code = generateCode();
    const codeLogin = await loginCodeModel.create({ userId, code })
    if (!codeLogin) {
        return next(new Error("Code not created"))
    }
    res.status(200).json({ message: "Done", code })
})


export const loginWithCode = asyncHandler(async (req, res, next) => {
    const { code } = req.body
    const codeLogin = await loginCodeModel.findOne({ code, used: false })
    if (!codeLogin) {
        return next(new Error("Code not found"))
    }
    const user = await userModel.findById(codeLogin.userId)
    if (!user) {
        return next(new Error("User not found"))
    }
    const update = await loginCodeModel.findByIdAndUpdate(codeLogin._id, { used: true }, { new: true })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SIGN_TOKEN, { expiresIn: "3d" });
    res.status(200).json({ message: "Login successful", token });

})