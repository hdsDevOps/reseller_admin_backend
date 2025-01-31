const { admin, db } = require("../firebaseConfig");
const { Timestamp } = require('firebase-admin').firestore;
const { sendmail } = require("../helper");
const helper = require('../helper');

async function getrecordlist(data) {
  // try {
  let billing_history = [];
  let query = db.collection("billing_history");
  if (data.domain) {
    query = query.where("domain", "==", data.domain);
  }
  if (data.start_date && data.start_date != "" && data.end_date && data.end_date != "") {
    let startdate = new Date(data.start_date);
    let enddate = new Date(data.end_date);
    // Set the start date to the beginning of the day
    startdate.setHours(0, 0, 0, 0);

    // Set the end date to the end of the day
    enddate.setHours(23, 59, 59, 999);
    const startDate = Timestamp.fromDate(startdate);
    const endDate = Timestamp.fromDate(enddate);
    query = query.where("created_at", ">=", startDate).where("created_at", "<=", endDate);
  }

  if (data.search_data && data.search_data != "") {
    data.search_data = data.search_data.trim();
    let search_text = data.search_data.toLowerCase();
    // Query 1: searchableIndex with lowercased search text
    let query1 = query.where("searchableIndex", "array-contains", search_text);

    // Query 2: searchableIndex with original search data
    let query2 = query.where("searchableIndex", "array-contains", data.search_data);

    // Execute both queries
    const [snapshot1, snapshot2] = await Promise.all([query1.get(), query2.get()]);

    // Process results from both snapshots
    snapshot1.forEach((doc) => {
      billing_history.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    snapshot2.forEach((doc) => {
      // Check for duplicate documents
      if (!billing_history.find((item) => item.id === doc.id)) {
        billing_history.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });

  } else {
    query = query.orderBy("created_at", "desc");
    const billing_history_snapshot = await query.get();
    if (!billing_history_snapshot.empty) {
      billing_history_snapshot.forEach((doc) => {
        billing_history.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }
  }
  if (data.sortdata) {
    if (data.sortdata.sort_text && data.sortdata.sort_text != "") {
      if (data.sortdata.sort_text == "customer_name") {
        if (data.sortdata.order == "asc") {
          billing_history.sort((a, b) => {
            if (a.customer_name < b.customer_name) {
              return -1;
            }
            if (a.customer_name > b.customer_name) {
              return 1;
            }
            return 0;
          });
        }
        if (data.sortdata.order == "desc") {
          billing_history.sort((a, b) => {
            if (a.customer_name < b.customer_name) {
              return 1;
            }
            if (a.customer_name > b.customer_name) {
              return -1;
            }
            return 0;
          });
        }
      }
      if (data.sortdata.sort_text == "date") {
        if (data.sortdata.order == "desc") {
          let dateA = convertTimestamp(a.date);
          let dateB = convertTimestamp(b.date);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
        }
        if (data.sortdata.order == "desc") {
          let dateA = convertTimestamp(a.date);
          let dateB = convertTimestamp(b.date);
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
        }
      }
      if (data.sortdata.sort_text == "amount") {
        if (data.sortdata.order == "asc") {
          billing_history.sort((a, b) => {
            if (a.transaction_data.amount < b.transaction_data.amount) {
              return -1;
            }
            if (a.transaction_data.amount > b.transaction_data.amount) {
              return 1;
            }
            return 0;
          });
        }
        if (data.sortdata.order == "desc") {
          billing_history.sort((a, b) => {
            if (a.transaction_data.amount < b.transaction_data.amount) {
              return 1;
            }
            if (a.transaction_data.amount > b.transaction_data.amount) {
              return -1;
            }
            return 0;
          });
        }
      }
    }
  }
  return {
    status: 200,
    data: billing_history,
  };
  // } catch (error) {
  //   throw new Error("Failed to fetch billing history: " + error.message);
  // }


}



module.exports = {
  getrecordlist,
};

const convertTimestamp = (timestamp) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};