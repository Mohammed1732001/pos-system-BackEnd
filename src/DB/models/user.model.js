import { Schema, model } from "mongoose";


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    }, phone: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'cashier'],
        default: 'cashier'
    }, age: {
        type: Number
    }

}, { timestamps: true })

const userModel = model("user", userSchema)

export default userModel