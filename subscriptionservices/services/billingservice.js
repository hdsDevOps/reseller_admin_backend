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
      };
  let searchKeyStart = "";
  let searchKeyEnd = "";
  let endDate = "";
  let startDate = "";
  let domain = "";
  

      let query = db.collection('billing_history');
      const transref = db.collection('customers');

// Add filters dynamically based on available data
if (data.domain && data.domain.trim() !== "") {
    query = query.where('domain', '==', data.domain);
}

if (filter.start_date && filter.start_date.trim() !== "") {
  startDate = new Date(filter.start_date);
  query.where("created_at", ">=", startDate); 
}

if (filter.end_date && filter.end_date.trim() !== "") {
  endDate = new Date(filter.end_date);
  query.where("created_at", "<=", endDate); 
}
if (filter.searchKey_start && filter.searchKey_start.trim() !== "") {
    query = query
          .orderBy('customer_name')
          .startAt(filter.searchKey_start.toLowerCase())
          .endAt(filter.searchKey_start.toLowerCase() + '\uf8ff');
}
// Fetch the records
const firstnameQuery = await query.get();

query = transref;


// Add filters dynamically based on available data
if (data.domain && data.domain.trim() !== "") {
  query = query.where('domain', '==', data.domain);
}

if (filter.start_date && filter.start_date.trim() !== "") {
startDate = new Date(filter.start_date);
query.where("created_at", ">=", startDate); 
}

if (filter.end_date && filter.end_date.trim() !== "") {
endDate = new Date(filter.end_date);
query.where("created_at", "<=", endDate); 
}
if (filter.searchKey_start && filter.searchKey_start.trim() !== "") {
  query = query
        .orderBy('customer_name')
        .startAt(filter.searchKey_start.toLowerCase())
        .endAt(filter.searchKey_start.toLowerCase() + '\uf8ff');
}
// Fetch the records
//const transQuery = await query.get();

const billing_history = [];
firstnameQuery.forEach(doc => {
  billing_history.push({ id: doc.id, ...doc.data() });
});

      return {
        status: 200,
        data: billing_history,
      };
    } catch (error) {
      throw new Error("Failed to fetch billing history: " + error.message);
    }
  }

  

  module.exports = {
    getrecordlist,
  };