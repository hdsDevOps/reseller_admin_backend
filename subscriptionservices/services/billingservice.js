const { admin, db } = require("../firebaseConfig");
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
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    query = query.where("created_at", ">=", startDate).where("created_at", "<=", endDate);
  }
  query = query.orderBy("created_at", "desc");
  if (data.search_data && data.search_data != "") {
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
    const billing_history_snapshot = await query.get();
    const billing_history = [];
    if (!billing_history_snapshot.empty) {
      billing_history_snapshot.forEach((doc) => {
        billing_history.push({
          id: doc.id,
          ...doc.data(),
        });
      });
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