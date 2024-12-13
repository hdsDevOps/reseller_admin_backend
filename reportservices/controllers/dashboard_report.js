const { admin, db,bucket } = require("../firebaseConfig");
const path = require('path');

class dashboard_report {
    async getreportdata(req, res){
        try {             
            const data_json = {
                "last_month_revenue":"1234",
                "current month recurring income":"400",
                "customers_who_use_stripe":"50",
                "new_customers_count_this_month":"10"
            }
              res.status(200).json({ message: 'Dashoard Report Data',result:data_json });
          } catch (error) {
              res.status(500).json({ message: error.message });
          }
    }

    async yearly_spending_statistics(req, res){
        try {     
            const currentYear = new Date().getFullYear();        
            const data_json = {
                "year":currentYear,
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
              res.status(200).json({ message: 'Dashoard Report Data',result:data_json });
          } catch (error) {
              res.status(500).json({ message: error.message });
          }
    }
}

module.exports = new dashboard_report();