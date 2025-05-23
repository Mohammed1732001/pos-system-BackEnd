import userModel from "../DB/models/user.model.js";



export const findUserById = async (id) => {
    const user = await userModel.findById(id)
    if (!user) {
        throw new Error("User not found");
    }
    return user
}

export const verifyEmailMatch = (user, email) => {
    if (user.email !== email) {
        throw new Error("Unauthorized to update this user");
    }
}

export const verifyPasswordMatch = (password, cPassword) => {
    if (password !== cPassword) {
        throw new Error("Passwords do not match");
    }
}