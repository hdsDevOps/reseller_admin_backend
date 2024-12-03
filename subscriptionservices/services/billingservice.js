const { admin, db } = require("../firebaseConfig");
const { sendmail } = require("../helper");
const helper = require('../helper');

async function getrecordlist(data) {
    try {
      const filter = {
        domain: data.domain,
        start_date: data.start_date,
        end_date: data.end_date,
      };
    
      const searchKey = data.search_data;
  
      // Queries for partial matches on firstname, lastname, and email
      let query = db.collection('billing_history');

      if (filter.domain) {
        const domain = new Date(filter.domain);
        query = query.where("domain", "==", domain);
      }

      if (filter.start_date) {
        const startDate = new Date(filter.start_date);
        query = query.where("start_date", ">=", startDate);
      }

      if (filter.end_date) {
        const endDate = new Date(filter.end_date);
        query = query.where("end_date", "<=", endDate);
      }
      

// Execute the query
const transactionQuery = await query.get();


      const customers = [];
      transactionQuery.forEach((doc) => {
        customers.push({
          ...doc.data(),
        });
      });
      return {
        status: 200,
        data: customers,
      };
    } catch (error) {
      throw new Error("Failed to fetch billing history: " + error.message);
    }
  }

  

  module.exports = {
    getrecordlist,
  };