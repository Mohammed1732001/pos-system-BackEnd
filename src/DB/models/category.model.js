import { Schema , model } from "mongoose";



const categorySchema = new Schema({
name: {
    type: String,
    required: true , 
    unique: true
}

}, { timestamps: true })


const categoryModel = model("category", categorySchema)

export default categoryModel