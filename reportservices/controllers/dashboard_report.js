const { admin, db, bucket } = require("../firebaseConfig");
const path = require('path');
const { Timestamp } = require('firebase-admin').firestore;
const helper = require("../helper.js")
class dashboard_report {
    async getreportdata(req, res) {
        try {
            let currency = 'USD';
            if (req.body.hasOwnProperty('currency')) {
                currency = req.body.currency;
            }
            const rate = await helper.getCurrencyRate(currency);

            // Get the current date 
            const now = new Date(); // Calculate the first day of the month
            const startOfprevoiusMonth = Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            // Calculate the first day of the next month
            const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            // Convert dates to Firestore Timestamps
            const startTimestamp = Timestamp.fromDate(startOfMonth);
            const endTimestamp = Timestamp.fromDate(startOfNextMonth);
            const currentdate = Timestamp.fromDate(now);

            // Query the collection for documents within the current month 
            const snapshot = await db.collection('customers')
                .where('createdAt', '>=', startTimestamp)
                .where('createdAt', '<', endTimestamp)
                .get();

            const records = [];
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    records.push({ id: doc.id, ...doc.data() });
                });
            }

            let query = db.collection('billing_history');
            query = query.where('date', '>', startOfprevoiusMonth);//last_month_revenue
            query = query.where('date', '<=', endTimestamp);//last_month_revenue
            const snapshot_revenue_last_month = await query.get();

            const snapshot_revenue_current_month = await db.collection('billing_history').where('date', '>', startTimestamp).where('date', '<=', currentdate).get();

            let lastmonthrevenue = 0;
            let convertedamount = 0;
            if (!snapshot_revenue_last_month.empty) {
                snapshot_revenue_last_month.forEach(doc => {
                    let data = doc.data();
                    if (data.transaction_data && data.transaction_data.amount && data.transaction_data.currency) {
                        let newCurrency = data.transaction_data.currency.toUpperCase();
                        convertedamount = rate["conversion_rates"][newCurrency]
                        lastmonthrevenue = lastmonthrevenue + (data.transaction_data.amount * convertedamount);
                    }
                });
            }

            let currentmonthrevenue = 0;
            if (!snapshot_revenue_current_month.empty) {
                snapshot_revenue_current_month.forEach(doc => {
                    let data = doc.data();
                    if (data.transaction_data && data.transaction_data.amount && data.transaction_data.currency) {
                        let newCurrency = data.transaction_data.currency.toUpperCase();
                        convertedamount = rate["conversion_rates"][newCurrency]
                        currentmonthrevenue = currentmonthrevenue + (data.transaction_data.amount * convertedamount);
                    }
                });
            }
            const snapshot_stripe_use_current_month = await db.collection('billing_history').where('date', '>', startTimestamp).where('date', '<=', currentdate).where("payment_method", "==", "Stripe").get();
            const striperecords = [];
            if (!snapshot_stripe_use_current_month.empty) {
                snapshot_stripe_use_current_month.forEach(doc => {
                    striperecords.push({ id: doc.id, ...doc.data() });
                });
            }

            const data_json = {
                "last_month_revenue": (lastmonthrevenue / 100).toFixed(2),
                "current_month_recurring_income": (currentmonthrevenue / 100).toFixed(2),
                "customers_who_use_stripe": striperecords.length,
                "new_customers_count_this_month": records.length
            }
            res.status(200).json({ message: 'Dashoard Report Data', result: data_json });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async yearly_spending_statistics(req, res) {
        try {

           

            const data_json = [
                {
                    "year": 2024,
                    "current_month_revenue": 400,
                    "data": [{
                        "month": "Jan",
                        "revenue_from_old_customers": 50,
                        "revenue_from_new_customers": 50
                    },
                    {
                        "month": "Feb",
                        "revenue_from_old_customers": 30,
                        "revenue_from_new_customers": 30
                    },
                    {
                        "month": "Mar",
                        "revenue_from_old_customers": 80,
                        "revenue_from_new_customers": 80
                    },
                    {
                        "month": "Apr",
                        "revenue_from_old_customers": 40,
                        "revenue_from_new_customers": 40
                    },
                    {
                        "month": "May",
                        "revenue_from_old_customers": 20,
                        "revenue_from_new_customers": 20
                    },
                    {
                        "month": "Jun",
                        "revenue_from_old_customers": 45,
                        "revenue_from_new_customers": 45
                    },
                    {
                        "month": "Jul",
                        "revenue_from_old_customers": 30,
                        "revenue_from_new_customers": 30
                    },
                    {
                        "month": "Aug",
                        "revenue_from_old_customers": 10,
                        "revenue_from_new_customers": 10
                    },
                    {
                        "month": "Sep",
                        "revenue_from_old_customers": 40,
                        "revenue_from_new_customers": 40
                    },
                    {
                        "month": "Oct",
                        "revenue_from_old_customers": 50,
                        "revenue_from_new_customers": 50
                    },
                    {
                        "month": "Nov",
                        "revenue_from_old_customers": 60,
                        "revenue_from_new_customers": 60
                    },
                    {
                        "month": "Dec",
                        "revenue_from_old_customers": 50,
                        "revenue_from_new_customers": 50
                    }
                    ]
                }

            ];
            res.status(200).json({ message: 'Dashoard Report Data', result: data_json });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new dashboard_report();