const { admin, db,bucket } = require("../firebaseConfig");
const path = require('path');
const { Timestamp } = require('firebase-admin').firestore;
class dashboard_report {
    async getreportdata(req, res){
        try {       
            // Get the current date 
            const now = new Date(); // Calculate the first day of the month
             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
             // Calculate the first day of the next month
            const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            // Convert dates to Firestore Timestamps
            const startTimestamp = Timestamp.fromDate(startOfMonth); 
            const endTimestamp = Timestamp.fromDate(startOfNextMonth);
            // Query the collection for documents within the current month 
            const snapshot = await db.collection('customers') 
            .where('created_at', '>=', startTimestamp) 
            .where('created_at', '<', endTimestamp) 
            .get(); 
            if (snapshot.empty) 
                { 
                    console.log('No matching documents.'); return []; 
                } // Collect the records 
                
                const records = [];
                 snapshot.forEach(doc => { 
                    records.push({ id: doc.id, ...doc.data() }); 
                }); 
             
            const data_json = {
                "last_month_revenue":"0",
                "current_month_recurring_income":"0",
                "customers_who_use_stripe":"0",
                "new_customers_count_this_month":records.length
            }
              res.status(200).json({ message: 'Dashoard Report Data',result:data_json });
          } catch (error) {
              res.status(500).json({ message: error.message });
          }
    }

    async yearly_spending_statistics(req, res){
        try {         
            const data_json = [
                    {
                        "year":2024,
                "current_month_revenue":400,
                "data":[{
                    "month":"Jan",
                    "revenue_from_old_customers":50,
                    "revenue_from_new_customers":50
                },
                {
                    "month":"Feb",
                    "revenue_from_old_customers":30,
                    "revenue_from_new_customers":30
                },
                {
                    "month":"Mar",
                    "revenue_from_old_customers":80,
                    "revenue_from_new_customers":80
                },
                {
                    "month":"Apr",
                    "revenue_from_old_customers":40,
                    "revenue_from_new_customers":40
                },
                {
                    "month":"May",
                    "revenue_from_old_customers":20,
                    "revenue_from_new_customers":20
                },
                {
                    "month":"Jun",
                    "revenue_from_old_customers":45,
                    "revenue_from_new_customers":45
                },
                {
                    "month":"Jul",
                    "revenue_from_old_customers":30,
                    "revenue_from_new_customers":30
                },
                {
                    "month":"Aug",
                    "revenue_from_old_customers":10,
                    "revenue_from_new_customers":10
                },
                {
                    "month":"Sep",
                    "revenue_from_old_customers":40,
                    "revenue_from_new_customers":40
                },
                {
                    "month":"Oct",
                    "revenue_from_old_customers":50,
                    "revenue_from_new_customers":50
                },
                {
                    "month":"Nov",
                    "revenue_from_old_customers":60,
                    "revenue_from_new_customers":60
                },
                {
                    "month":"Dec",
                    "revenue_from_old_customers":50,
                    "revenue_from_new_customers":50
                }
            ] 
        },
        {
            "year":2023,
    "current_month_revenue":400,
    "data":[{
        "month":"Jan",
        "revenue_from_old_customers":50,
        "revenue_from_new_customers":50
    },
    {
        "month":"Feb",
        "revenue_from_old_customers":30,
        "revenue_from_new_customers":30
    },
    {
        "month":"Mar",
        "revenue_from_old_customers":80,
        "revenue_from_new_customers":80
    },
    {
        "month":"Apr",
        "revenue_from_old_customers":40,
        "revenue_from_new_customers":40
    },
    {
        "month":"May",
        "revenue_from_old_customers":20,
        "revenue_from_new_customers":20
    },
    {
        "month":"Jun",
        "revenue_from_old_customers":45,
        "revenue_from_new_customers":45
    },
    {
        "month":"Jul",
        "revenue_from_old_customers":30,
        "revenue_from_new_customers":30
    },
    {
        "month":"Aug",
        "revenue_from_old_customers":10,
        "revenue_from_new_customers":10
    },
    {
        "month":"Sep",
        "revenue_from_old_customers":40,
        "revenue_from_new_customers":40
    },
    {
        "month":"Oct",
        "revenue_from_old_customers":50,
        "revenue_from_new_customers":50
    },
    {
        "month":"Nov",
        "revenue_from_old_customers":60,
        "revenue_from_new_customers":60
    },
    {
        "month":"Dec",
        "revenue_from_old_customers":50,
        "revenue_from_new_customers":50
    }
] 
}
    
    ];
              res.status(200).json({ message: 'Dashoard Report Data',result:data_json });
          } catch (error) {
              res.status(500).json({ message: error.message });
          }
    }
}

module.exports = new dashboard_report();