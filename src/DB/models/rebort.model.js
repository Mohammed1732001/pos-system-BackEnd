import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    type: {
        type: String,
        enum: ['daily', 'monthly'],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    totalSales: {
        type: Number,
        default: 0,
    },
    totalTax: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const reportModel = model("report", reportSchema);
export default reportModel;