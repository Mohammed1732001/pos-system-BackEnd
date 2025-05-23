import { Schema, Types, model } from "mongoose";


const tableSchema = new Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    seats: {
        type: Number,
        
    },
    status: {
        type: String,
        enum: ['open', 'reserved', 'closed'],
        default: 'open',
    },
    activeOrderId: {
        type: Types.ObjectId,
        ref: 'order',
    },
    orders: [{
        type: Types.ObjectId,
        ref: 'order',
    }],
    invoice: {
        type: Types.ObjectId,
        ref: 'invoice',
    },
    invoices: [{
        type: Types.ObjectId,
        ref: 'invoice',
    }],

}, { timestamps: true })


const tableModel = model("table", tableSchema)
export default tableModel