import invoiceModel from "../../../DB/models/invoice.model.js"
import orderModel from "../../../DB/models/order.model.js"
import tableModel from "../../../DB/models/table.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"

export const getTable = asyncHandler(async (req, res, next) => {
    const tables = await tableModel.find().populate();
    res.status(200).json({ message: "Done", tables });
});
export const UpdateTable = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { seats } = req.body;
    const getTable = await tableModel.findById(id);
    if (!getTable) return next(new Error("Table not found"));

    const table = await tableModel.findByIdAndUpdate(id, { seats }, { new: true });
    res.status(200).json({ message: "Done", table });
});

export const getTableById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const table = await tableModel.findById(id).populate("activeOrderId").populate({
        path: "invoices",
        populate: {
            path: "cashierId",
            model: "user"
        }
    }).populate({
        path: "orders",
        populate: {
            path: "cashierId",
            model: "user"
        }
    });
    if (!table) return next(new Error("Table not found"));
    res.status(200).json({ message: "Done", table });
});

export const deleteTable = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const table = await tableModel.findById(id);
    if (!table) return next(new Error("Table not found"));
    await tableModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Done Deleted" });
});

export const creatTable = asyncHandler(async (req, res, next) => {
    const { tableNumber, seats } = req.body;
    const findTable = await tableModel.findOne({ tableNumber });
    if (findTable) return next(new Error("Table already found"));
    const table = await tableModel.create({ tableNumber, seats });
    res.status(201).json({ message: "Done", table });
});

export const reserveTable = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let table = await tableModel.findById(id);
    if (!table) return next(new Error("Table not found"));
    if (table.status === 'reserved') return next(new Error("Table is already reserved"));
    if (table.status === 'closed') return next(new Error("Please create the invoice first"));

    if (table.invoice) {
        await tableModel.findByIdAndUpdate(id, {
            $push: { invoices: table.invoice },
            $unset: { invoice: "" }
        });
    }

    table = await tableModel.findByIdAndUpdate(id, { status: 'reserved' }, { new: true });
    res.status(200).json({ message: "Table reserved", table });
});

export const createOrderforTable = asyncHandler(async (req, res, next) => {
    const { items } = req.body;
    const { id } = req.params;
    const findTaple = await tableModel.findById(id);
    if (!findTaple) return next(new Error("Table not found"));
    if (findTaple.status === "open") return next(new Error("Table is open please reserve it first"));
    if (findTaple.activeOrderId) return next(new Error("Table already has an active order"));

    const order = await orderModel.create({ tableId: findTaple._id, cashierId: req.user._id, items });
    const updatedTable = await tableModel.findByIdAndUpdate(id, { activeOrderId: order._id }, { new: true });
    res.status(200).json({ message: "Done", order, updatedTable });
});

export const closeOrderForTable = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const table = await tableModel.findById(id);
    if (!table) return next(new Error("Table not found"));
    if (!table.activeOrderId) return next(new Error("Table does not have an active order"));
    if (table.status === "open") return next(new Error("please receved the taple frist"));
    if (table.status === 'closed') return next(new Error("please create the invoice first"));

    const updatedTable = await tableModel.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
    res.status(200).json({ message: "Done open this taple", updatedTable });
});

export const createInvoice = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { discount } = req.body
    const table = await tableModel.findById(id);

    if (!table) return next(new Error("Table not found"));
    if (table.status !== 'closed') return next(new Error("Table is not closed"));

    const order = await orderModel.findByIdAndUpdate(table.activeOrderId, { status: "closed" });

    if (!order) return next(new Error("Order not found"));

    const updatedTable = await tableModel.findByIdAndUpdate(id, {
        $push: { orders: table.activeOrderId },
        $unset: { activeOrderId: "" }
    }, { new: true });

    const totalAmount = order.totalAmount || 0;
    const taxAmount = totalAmount > 0 ? totalAmount * 0.14 : 0;
    const validDiscount = (discount && discount > 0) ? discount : 0;
    if (validDiscount > totalAmount) {
        validDiscount = totalAmount;
    }
    const finalAmount = totalAmount - validDiscount + taxAmount;


    const invoice = await invoiceModel.create({
        orderId: order._id,
        totalAmount: order.totalAmount,
        cashierId: order.cashierId,
        finalAmount
    });
    const updatedTableInvoice = await tableModel.findByIdAndUpdate(id, { invoice: invoice._id, status: "open" }, { new: true });

    res.status(200).json({ message: "Done", invoice, updatedTableInvoice });
});

export const getAllTaplesWithDitails = asyncHandler(async (req, res, next) => {

    const tables = await tableModel.find();
    const populatedTables = await Promise.all(
        tables.map(async (table) => {
            const orders = await orderModel.find({ tableId: table._id });
            const invoices = await invoiceModel.find({
                orderId: { $in: orders.map((order) => order._id) },
            });

            return {
                ...table.toObject(),
                orders,
                invoices,
            };
        })
    );

    return res.json({ message: "Done", tables: populatedTables });
})
export const getAllTapleOneWithDitails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const table = await tableModel.findById(id);
    if (!table) {
        return next(new Error("Table not found"));
    }
    const orders = await orderModel.find({ tableId: table._id });
    const invoices = await invoiceModel.find({
        orderId: { $in: orders.map((order) => order._id) },
    });

    return res.json({
        message: "Done",
        table: {
            ...table.toObject(),
            orders,
            invoices,
        },
    });
})