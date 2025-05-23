import { Schema, Types, model } from "mongoose";


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    }, price: {
        type: Number,
        required: true
    },
    category: {
        type: Types.ObjectId,
        ref: 'category',
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    imagePuplicId: {
        type: String,
    },
    description: {
        type: String,
        required: true

    }

}, { timestamps: true })


const productModel = model("product", productSchema)
export default productModel