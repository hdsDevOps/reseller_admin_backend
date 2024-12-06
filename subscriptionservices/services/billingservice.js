const { admin, db } = require("../firebaseConfig");
const { sendmail } = require("../helper");
const helper = require('../helper');

async function getrecordlist(data) {
    try {
      const filter = {
        domain: data.domain,
        start_date: data.start_date,
        end_date: data.end_date,
        searchKey_start: data.search_data.toLowerCase(),
        searchKey_end: data.search_data.toLowerCase() + '\uf8ff' 
      };
  let searchKeyStart = "";
  let searchKeyEnd = "";
  let endDate = "";
  let startDate = "";
  let domain = "";
      // Queries for partial matches on firstname, lastname, and email
      let query = db.collection('billing_history');

      if (filter.domain) {
        domain = filter.domain;
        
      }

      if (filter.start_date) {
        startDate = new Date(filter.start_date);
        
      }

      if (filter.end_date) {
        endDate = new Date(filter.end_date);
        
      }

      if (filter.searchKey_start && filter.searchKey_end) {
        searchKeyStart = filter.searchKey_start;
        searchKeyEnd = filter.searchKey_end;

      }
      
      


      const query1 = db
  .collection("billing_history")
  .where("customer_name", ">=", searchKeyStart)
  .where("domain", "==", domain)
  .where("created_at", ">=", startDate)
  .where("created_at", "<=", endDate)
  .where("customer_name", "<=", searchKeyEnd);

const query2 = db
  .collection("billing_history")
  .where("transaction_id", ">=", searchKeyStart)
  .where("domain", "==", domain)
  .where("created_at", ">=", startDate)
  .where("created_at", "<=", endDate)
  .where("transaction_id", "<=", searchKeyEnd);

const [result1, result2] = await Promise.all([query1.get(), query2.get()]);

// Merge results
const customers = [
  ...result1.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  ...result2.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
];

// Remove duplicates
const uniqueCustomers = customers.filter(
  (value, index, self) => index === self.findIndex((t) => t.id === value.id)
);
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