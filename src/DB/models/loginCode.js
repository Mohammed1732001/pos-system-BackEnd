import { Schema, model, Types } from "mongoose";




const loginCodeSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'user',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    , used: {
        type: Boolean,
        default: false
    }
},)


const loginCodeModel = model("loginCode", loginCodeSchema)

export default loginCodeModel