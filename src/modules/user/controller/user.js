import { asyncHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../DB/models/user.model.js";
import { hash } from "../../../utils/hashAndCompare.js";
import { findUserById, verifyEmailMatch, verifyPasswordMatch } from "../../../utils/userHelper.js";



export const getAllUser = asyncHandler(async (req, res, next) => {
    const users = await userModel.find()
    res.status(200).json({ message: "Done", users })
})

export const updateOwnUser = asyncHandler(async (req, res, next) => {
    const { userName, phone, age } = req.body
    const { id, email } = req.user
    const user = await findUserById(id);
    verifyEmailMatch(user, email)
    const updatedUser = await userModel.findByIdAndUpdate(id, { userName, phone, age }, { new: true })
    res.status(200).json({ message: "Done updted sucess", updatedUser })


})

export const updateAnyUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { userName, phone, age, password, cPassword } = req.body
    const user = await findUserById(id);
    let updateUser = { userName, phone, age }
    if (password) {
        verifyPasswordMatch(password, cPassword)
        const hashPassword = hash({ plainText: password })
        updateUser.password = hashPassword
    }
    const updatedUser = await userModel.findByIdAndUpdate(id, updateUser, { new: true })
    res.status(200).json({ message: "Done", updatedUser })

})

export const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.user.id !== id && req.user.role !== "admin") {
        return next(new Error("Unauthorized to get user"))
    }
    const user = await findUserById(id)
    res.status(200).json({ message: "Done", user })
})

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await findUserById(id)
    const deletedUser = await userModel.findByIdAndDelete(id)
    res.status(200).json({ message: "Delete Success" })

})