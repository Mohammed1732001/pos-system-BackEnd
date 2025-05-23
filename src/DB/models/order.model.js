import { Schema, Types, model } from "mongoose";



const orderSchema = new Schema({
    tableId: {
        type: Types.ObjectId,
        ref: 'table',
        required: true,
    },
    cashierId: {
        type: Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [
        {
            productId: {
                type: Types.ObjectId,
                ref: 'product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
            },
            total: {
                type: Number,
            },
        },
    ],
    totalAmount: {
        type: Number,

    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    invoiceId: {
        type: Types.ObjectId,
        ref: 'invoice', // هنضيف الموديل ده بعد كده
    },
    customerNotes: {
        type: String,
    },
    closedAt: {
        type: Date,
    }
}, { timestamps: true })



orderSchema.pre('save', async function (next) {
    const order = this;

    if (!order.items || order.items.length === 0) {
        order.totalAmount = 0;
        return next();
    }

    await order.populate('items.productId');

    order.items.forEach(item => {
        const product = item.productId;
        if (product && item.quantity) {
            item.total = product.price * item.quantity;
        } else {
            item.total = 0;
        }
    });

    order.totalAmount = order.items.reduce((acc, item) => acc + (item.total || 0), 0);

    next();
});

const orderModel = model("order", orderSchema)


export default orderModel