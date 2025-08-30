const Usage = require('../models/Usage');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const { PLAN_TYPES } = require('../constants/constants');
const mongoose = require("mongoose");

exports.generateMonthlyInvoice = async (clientId, month) => {
    // 1. Parse month ("YYYY-MM" or "MM")
    let year, monthNum;
    if (month.includes('-')) {
        [year, monthNum] = month.split('-').map(Number);
    } else {
        year = new Date().getFullYear();
        monthNum = parseInt(month);
    }
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);
    const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
    const clientObjectId = new mongoose.Types.ObjectId(clientId);
    // 2. Use aggregation to compute grouped totals
    const usageAgg = await Usage.aggregate([
        {
            $match: {
                clientId: clientObjectId,
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: "$planType",
                amount: { $sum: "$cost" },
                totalRequests: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                planType: "$_id",
                amount: { $round: ["$amount", 2] },   // round to 2 decimals
                totalRequests: 1
            }
        }
    ]);

    if (!usageAgg.length) {
        return null; // no usage → no invoice
    }

    // 3. Fetch client with subscriptions (same as before)
    const client = await Client.findById(clientId)
        .populate({
            path: 'subscriptions',
            match: { type: 'bundle', status: 'active' },
            populate: { path: 'details.bundleId' }
        });

    if (!client) {
        throw new Error('Client not found');
    }

    // 4. Build breakdown from aggregation result
    let breakdown = {
        payPerUse: { amount: 0, totalRequests: 0 },
        bundle: { amount: 0, totalRequests: 0, discount: 0 },
        event: { amount: 0, totalRequests: 0 },
    };
    let total = 0;

    usageAgg.forEach(row => {
        breakdown[row.planType].amount = row.amount;
        breakdown[row.planType].totalRequests = row.totalRequests;
        total = Number((total + row.amount).toFixed(2));
    });

    // 5. Apply bundle discount (same as before)
    const userSub = client.subscriptions.find((sub) => sub.type === "bundle");
    if (userSub) {
        const { discountRules } = userSub.details.bundleId;
        const bundleData = breakdown.bundle;

        if (bundleData.totalRequests >= discountRules.threshold) {
            const discountAmount = Number((bundleData.amount * discountRules.discountPercentage).toFixed(2));
            breakdown.bundle.discount = discountAmount;
            breakdown.bundle.amount = Number((bundleData.amount - discountAmount).toFixed(2));
            total = Number((total - discountAmount).toFixed(2));
        }
    }

    // 6. Upsert invoice
    const invoice = await Invoice.findOneAndUpdate(
        { clientId, month: monthKey },
        {
            clientId,
            month: monthKey,
            totalAmount: total,
            breakdown
        },
        { new: true, upsert: true }
    );

    return invoice;
};


// exports.generateMonthlyInvoice_v1 = async (clientId, month) => {
//     // 1. Parse month ("YYYY-MM" or "MM")
//     let year, monthNum;
//     if (month.includes('-')) {
//         [year, monthNum] = month.split('-').map(Number);
//     } else {
//         year = new Date().getFullYear();
//         monthNum = parseInt(month);
//     }
//     const startDate = new Date(year, monthNum - 1, 1);
//     const endDate = new Date(year, monthNum, 1);
//     const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;

//     // 2. Fetch all usage for that client & month
//     const usages = await Usage.find({
//         clientId,
//         createdAt: { $gte: startDate, $lt: endDate }
//     });

//     if (!usages.length) {
//         return null; // no usage → no invoice
//     }

//     // 3. Fetch client with subscriptions populated with bundle details
//     const client = await Client.findById(clientId)
//         .populate({
//             path: 'subscriptions',
//             match: { type: 'bundle', status: 'active' },
//             populate: { path: 'details.bundleId' } // this gives you bundle object
//         });

//     if (!client) {
//         throw new Error('Client not found');
//     }

//     // 4. Initialize breakdown
//     let breakdown = {
//         payPerUse: { amount: 0, totalRequests: 0 },
//         bundle: { amount: 0, totalRequests: 0, discount: 0 },
//         event: { amount: 0, totalRequests: 0 },
//     };
//     let total = 0;

//     // 5. Group usage by planType
//     usages.forEach(u => {
//         switch (u.planType) {
//             case PLAN_TYPES.PAY_PER_USE:
//                 breakdown.payPerUse.amount = Number((breakdown.payPerUse.amount + u.cost).toFixed(2));
//                 breakdown.payPerUse.totalRequests += 1;
//                 total = Number((total + u.cost).toFixed(2));
//                 break;
//             case PLAN_TYPES.BUNDLE:
//                 breakdown.bundle.amount = Number((breakdown.bundle.amount + u.cost).toFixed(2));
//                 breakdown.bundle.totalRequests += 1;
//                 total = Number((total + u.cost).toFixed(2));
//                 break;
//             case PLAN_TYPES.EVENT:
//                 breakdown.event.amount = Number((breakdown.event.amount + u.cost).toFixed(2));
//                 breakdown.event.totalRequests += 1;
//                 total = Number((total + u.cost).toFixed(2));
//                 break;
//         }
//     });

//     // 6. Apply bundle threshold discounts using client.subscriptions
//     const userSub = client.subscriptions.find((sub) => sub.type === "bundle");
//     if (userSub) {
//         const { discountRules } = userSub.details.bundleId;
//         const bundleData = breakdown.bundle;

//         if (bundleData.totalRequests >= discountRules.threshold) {
//             const discountAmount = Number((bundleData.amount * discountRules.discountPercentage).toFixed(2));
//             breakdown.bundle.discount = discountAmount;
//             breakdown.bundle.amount = Number((bundleData.amount - discountAmount).toFixed(2));
//             total = Number((total - discountAmount).toFixed(2));
//         }
//     }

//     // 7. Upsert invoice (override if exists)
//     const invoice = await Invoice.findOneAndUpdate(
//         { clientId, month: monthKey },
//         {
//             clientId,
//             month: monthKey,
//             totalAmount: total,
//             breakdown
//         },
//         { new: true, upsert: true }
//     );

//     return invoice;
// };
