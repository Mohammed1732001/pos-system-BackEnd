import { asyncHandler } from "../../../utils/errorHandling.js";
import invoiceModel from "../../../DB/models/invoice.model.js";
import reportModel from "../../../DB/models/rebort.model.js";



export const getAdminDashboard = asyncHandler(async (req, res, next) => {

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const invoicesToday = await invoiceModel.find({
        createdAt: { $gte: startOfDay }
    });

    const invoicesThisMonth = await invoiceModel.find({
        createdAt: { $gte: startOfMonth }
    });

    const calcTotals = (invoices) => {
        const totalSales = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
        const totalTax = invoices.reduce((acc, inv) => acc + (inv.taxAmount || 0), 0);
        const totalDiscount = invoices.reduce((acc, inv) => acc + (inv.discount || 0), 0);
        const balance = totalSales - totalDiscount + totalTax;

        return { totalSales, totalTax, totalDiscount, balance };
    };

    const dailyTotals = calcTotals(invoicesToday);
    let reportDay = await reportModel.findOneAndUpdate(
        { type: 'daily', date: { $gte: startOfDay } },
        { ...dailyTotals, date: now },
        { new: true, upsert: true } 
    );

    const monthlyTotals = calcTotals(invoicesThisMonth);
    let reportMonth = await reportModel.findOneAndUpdate(
        { type: 'monthly', date: { $gte: startOfMonth } },
        { ...monthlyTotals, date: now },
        { new: true, upsert: true }
    );

    res.status(200).json({
        message: "Dashboard loaded with auto-updated reports.",
        reportDay,
        reportMonth
    });

});

