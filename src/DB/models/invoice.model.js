import { Schema, Types, model } from "mongoose";

const invoiceSchema = new Schema({
    orderId: {
        type: Types.ObjectId,
        ref: 'order',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'digital_wallet'],
        required: true,
        default: 'cash',
    },
    taxAmount: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
    },
    cashierId: {
        type: Types.ObjectId,
        ref: 'user',
        required: true,
    },


}, { timestamps: true })


invoiceSchema.pre("save", async function (next) {
    try {
        if (!this.totalAmount || this.totalAmount === 0) {
            const order = await this.model('order').findById(this.orderId).lean();
            if (!order) {
                throw new Error("Order not found");
            }
            this.totalAmount = order.totalAmount ?? 0;
        }

        this.finalAmount = this.totalAmount - this.discount + this.taxAmount;

        next();
    } catch (error) {
        next(error);
    }
});






invoiceSchema.method.generateInvoice = function () {
    return {
        invoiceNumber: this._id,
        orderId: this.orderId,
        totalAmount: this.totalAmount,
        taxAmount: this.taxAmount,
        discount: this.discount,
        finalAmount: this.finalAmount || 0,
        paymentStatus: this.paymentStatus,
        paymentMethod: this.paymentMethod,
        issueDate: this.issueDate,
    }
}


const invoiceModel = model("invoice", invoiceSchema)

export default invoiceModel