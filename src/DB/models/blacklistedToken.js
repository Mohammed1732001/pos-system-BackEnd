import { Schema, model } from "mongoose";



const blacklistedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }

})



blacklistedTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 }); // 86400 ثانية = 24 ساعة


const blacklistedTokenModel = model("blacklistedToken", blacklistedTokenSchema)

export default blacklistedTokenModel

