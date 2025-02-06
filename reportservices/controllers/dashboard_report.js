const { admin, db, bucket } = require("../firebaseConfig");
const path = require('path');
const { Timestamp } = require('firebase-admin').firestore;
const helper = require("../helper.js");
const { ChildProcess } = require("child_process");
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
                .where('createdAt', '>', startTimestamp)
                .where('createdAt', '<=', endTimestamp)
                .where('status', '==', 'active')
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
            const revenue_last_month = [];
            if (!snapshot_revenue_last_month.empty) {
                let transactionMap = new Map(); // Create a map to store unique transactions

                snapshot_revenue_last_month.forEach(doc => {
                    let data = doc.data();
                    // Convert Firestore Timestamp to JavaScript Date
                    let date = data.date.toDate();
                    // Convert JavaScript Date to a readable date string
                    let dateString = date.toISOString().split('T')[0];

                    if (data.transaction_data && data.transaction_data.amount && data.transaction_data.currency) {
                        let transactionId = data.transaction_id;
                        let amount = data.transaction_data.amount;

                        // Check if the transaction already exists in the map
                        if (transactionMap.has(transactionId)) {
                            let existingData = transactionMap.get(transactionId);
                            // Compare the amounts and keep the greater one
                            if (existingData.amount < amount) {
                                transactionMap.set(transactionId, data); // Update with new data if the amount is greater
                            }
                        } else {
                            transactionMap.set(transactionId, data); // Add new transaction to the map
                        }
                    }
                });

                // Iterate over the unique transactions and process them
                transactionMap.forEach((data, transactionId) => {
                    let date = data.date.toDate();
                    let dateString = date.toISOString().split('T')[0];
                    let newCurrency = data.transaction_data.currency.toUpperCase();

                    revenue_last_month.push({
                        date: dateString,
                        currency: data.transaction_data.currency,
                        amount: data.transaction_data.amount,
                        rate: rate["conversion_rates"][newCurrency],
                        convertedamount: data.transaction_data.amount / rate["conversion_rates"][newCurrency]
                    });

                    let convertedamount = rate["conversion_rates"][newCurrency];
                    lastmonthrevenue = lastmonthrevenue + (data.transaction_data.amount / convertedamount);
                });
            }

            const revenue_current_month = [];
            let currentmonthrevenue = 0;
            if (!snapshot_revenue_current_month.empty) {
                snapshot_revenue_current_month.forEach(doc => {
                    let data = doc.data();
                    // Convert Firestore Timestamp to JavaScript Date
                    let date = data.date.toDate();
                    // Convert JavaScript Date to a readable date string
                    let dateString = date.toISOString().split('T')[0];

                    if (data.transaction_data && data.transaction_data.amount && data.transaction_data.currency && data.transaction_data.currency != null && data.transaction_data.currency != undefined) {
                        let newCurrency = data.transaction_data.currency.toUpperCase();
                        revenue_current_month.push({
                            date: dateString,
                            currency: data.transaction_data ? data.transaction_data.currency : null,
                            amount: data.transaction_data ? data.transaction_data.amount : null,
                            rate: rate["conversion_rates"][newCurrency],
                            convertedamount: data.transaction_data.amount / rate["conversion_rates"][newCurrency]
                        });

                        convertedamount = rate["conversion_rates"][newCurrency]
                        currentmonthrevenue = currentmonthrevenue + (data.transaction_data.amount / convertedamount);
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
            res.status(200).json({ message: 'Dashoard Report Data', result: data_json, revenue_current_month: revenue_current_month, revenue_last_month: revenue_last_month });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async yearly_spending_statistics(req, res) {
        try {
            const year = Number(req.body.year) || new Date().getFullYear(); // Specify the year you want to retrieve data for               
            const startOfYear = admin.firestore.Timestamp.fromDate(new Date(year, 0, 1)); // January 1st of the specified year
            const endOfYear = admin.firestore.Timestamp.fromDate(new Date(year + 1, 0, 1)); // January 1st of the next year

            let currency = 'USD';
            if (req.body.hasOwnProperty('currency')) {
                currency = req.body.currency;
            }
            const rate = await helper.getCurrencyRate(currency);




            let billing_history = [];
            let query = db.collection("billing_history");
            query = query.where('created_at', '>=', startOfYear).where('created_at', '<', endOfYear).orderBy('created_at', 'asc');
            const snapshot = await query.get();

            if (!snapshot.empty) {
                for (const doc of snapshot.docs) {
                    const data = doc.data();
                    billing_history.push({ id: doc.id, ...doc.data() });
                }
            }

            let customers = [];
            let customerRef = await db.collection("customers").get();
            if (!customerRef.empty) {
                for (const doc of customerRef.docs) {
                    customers.push({ id: doc.id, ...doc.data() });
                }
            }
            const customerMap = new Map();
            for (const customer of customers) {
                customerMap.set(customer.id, customer);
            }
            // Process the data
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const revenueData = {
                year: year,
                current_month_revenue: 0,
                data: monthNames.map(month => ({
                    month: month,
                    revenue_from_old_customers: 0,
                    revenue_from_new_customers: 0
                }))
            };

            for (const entry of billing_history) {
                const date = entry.created_at ? new Date(entry.created_at._seconds * 1000) || "" : ""; // Convert Firestore timestamp to Date
                const month = date.toLocaleString('default', { month: 'short' }); // Get month name abbreviation

                const monthData = revenueData.data.find(m => m.month === month);
                let isNewCustomer = false;
                if (customerMap.has(entry.user_id)) {
                    const customer = customerMap.get(entry.user_id);
                    const customerCreatedAt = new Date(customer.createdAt._seconds * 1000);
                    isNewCustomer = (customerCreatedAt.getFullYear() === date.getFullYear() &&
                        customerCreatedAt.getMonth() === date.getMonth());
                }
                if (entry.transaction_data && entry.transaction_data.amount) {
                    const newCurrency = entry.transaction_data && entry.transaction_data.currency ? entry.transaction_data.currency.toUpperCase() : "";
                    const amountInOriginalCurrency = entry.transaction_data.amount || 0;
                    const conversionRate = rate["conversion_rates"][newCurrency];

                    if (!conversionRate || isNaN(conversionRate)) {
                        console.error(`Invalid conversion rate for currency: ${newCurrency}`);
                        continue;
                    }

                    const amountInBaseCurrency = parseFloat((amountInOriginalCurrency / conversionRate).toFixed(2));

                    if (!isNewCustomer) {
                        monthData.revenue_from_old_customers += amountInBaseCurrency;
                    } else {
                        monthData.revenue_from_new_customers += amountInBaseCurrency;
                    }
                }
                // Update current month revenue
                if (date != "" && new Date().getMonth() === date.getMonth() && new Date().getFullYear() === year) {

                    revenueData.current_month_revenue += (monthData.revenue_from_old_customers || 0) + (monthData.revenue_from_new_customers || 0);
                }
            }

            // console.log(revenueData);
            res.status(200).json({ message: 'Dashboard Report Data', result: [revenueData] });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new dashboard_report();