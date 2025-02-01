const { admin, db } = require("../firebaseConfig");
const { sendmail } = require("../helper");
const helper = require('../helper');
const { use } = require("../routes/voucherroute");
const table_name = "vouchers";

async function getVoucherList(data) {
  try {
    const filter = {
      currency: data.currency,
      voucher_code: data.voucher_code,
      start_date: data.start_date,
      end_date: data.end_date,
    };

    let query = db.collection(table_name).where("is_deleted", "==", 1);

    // Apply filters dynamically
    if (filter.currency) {
      query = query.where("currency", "==", filter.currency);
    }

    if (filter.voucher_code) {
      const start = data.voucher_code.toLowerCase();
      const end = data.voucher_code.toLowerCase() + '\uf8ff';
      query = query.where("voucher_code_lower", ">=", start);
      query = query.where("voucher_code_lower", "<=", end);
    }

    if (filter.start_date) {
      let startDate = new Date(filter.start_date);
      let start_date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
      query = query.where("start_date", ">=", Timestamp.fromDate(start_date));
    }

    if (filter.end_date) {
      let endDate = new Date(filter.end_date);
      let end_date = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
      query = query.where("end_date", "<=", Timestamp.fromDate(end_date));
    }

    if (data.sortdata) {
      if (data.sortdata.sort_text != "") {
        sorttext=data.sortdata.sort_text == "discount" ? "discount_rate" : data.sortdata.sort_text;
       let sortorder = data.sortdata.order;
        if (data.sortdata.order !== "asc" && data.sortdata.order !== "desc") {
          throw new Error("Invalid sort order. Must be either 'asc' or 'desc'.");
      }
        
        query = query.orderBy(sorttext, sortorder);
      }
    }else{
      query = query.orderBy("created_at", "desc");
    }

    // Execute the query
    const voucherSnapshot = await query.get();

    const voucherList = voucherSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      //start_date: doc.data().start_date ? doc.data().start_date.toDate() : null,
      //end_date: doc.data().end_date ? doc.data().end_date.toDate() : null,
      //created_at: doc.data().created_at ? doc.data().created_at.toDate() : null,
      //updated_at: doc.data().updated_at ? doc.data().updated_at.toDate() : null,
    }));
    if (voucherSnapshot.empty) {
      return {
        status: 200,
        message: "No voucher record found",
        data: [],
      };
    } else {
      return {
        status: 200,
        message: "Voucher list retrieved successfully",
        data: voucherList,
      };
    }
  } catch (error) {
    console.error("Error in getVoucherList:", error);
    return {
      status: 500,
      message: "Error retrieving voucher list",
      error: error.message,
    };
  }
}

async function addnewvoucher(data) {
  try {
    // Input validation
    if (
      !data.voucher_code ||
      !data.start_date ||
      !data.end_date ||
      !data.discount_rate ||
      !data.template_details ||
      !data.currency
    ) {
      return { status: 400, message: "Missing required fields" };
    }

    const vouchersnap = await db.collection("vouchers").where("voucher_code", "==", data.voucher_code).get();
    if (!vouchersnap.empty) {
      return { status: 400, message: "Voucher code already in use", }
    }



    // Create new staff document
    const newStaff = {
      voucher_code: data.voucher_code,
      voucher_code_lower: data.voucher_code.toLowerCase(),
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      discount_rate: data.discount_rate,
      template_details: data.template_details,
      currency: data.currency,
      is_deleted: 1,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(table_name).add(newStaff);

    return {
      status: 200,
      message: "Voucher added successfully",
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error in add voucher:", error);
    return {
      status: 500,
      message: "Error adding voucher",
      error: error.message,
    };
  }
}

async function editvoucher(data) {
  try {
    // Input validation
    if (
      !data.voucher_code ||
      !data.start_date ||
      !data.end_date ||
      !data.discount_rate ||
      !data.template_details ||
      !data.currency ||
      !data.record_id
    ) {
      return { status: 400, message: "Missing required fields" };
    }
    const vouchersnap = await db.collection("vouchers").where("voucher_code", "==", data.voucher_code).get();
    let voucherExists = false;
    vouchersnap.forEach(doc => {
      if (doc.id !== data.record_id) {
        voucherExists = true;
      }
    });

    if (voucherExists) {
      return { status: 400, message: "Voucher code already in use" }
    }
    const voucherRef = db.collection(table_name).doc(data.record_id);
    const doc = await voucherRef.get();

    if (!doc.exists) {
      return { status: 404, message: "Voucher record not found" };
    }

    await voucherRef.update({
      voucher_code: data.voucher_code,
      voucher_code_lower: data.voucher_code.toLowerCase(),
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      discount_rate: data.discount_rate,
      template_details: data.template_details,
      currency: data.currency,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      status: 200,
      message: "Voucher updated successfully",
    };
  } catch (error) {
    console.error("Error in add voucher:", error);
    return {
      status: 500,
      message: "Error update voucher",
      error: error.message,
    };
  }
}

async function deletevoucher(data) {
  try {
    // Input validation
    if (
      !data.record_id
    ) {
      return { status: 400, message: "Missing required fields" };
    }

    const voucherRef = db.collection(table_name).doc(data.record_id);
    const doc = await voucherRef.get();

    if (!doc.exists) {
      return { status: 404, message: "Voucher record not found" };
    }

    await voucherRef.update({
      is_deleted: 0,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      status: 200,
      message: "Voucher deleted successfully",
    };
  } catch (error) {
    console.error("Error in add voucher:", error);
    return {
      status: 500,
      message: "Error delete voucher",
      error: error.message,
    };
  }
}

async function sendvochermail(data) {
  try {
    // Input validation
    if (
      !data.record_id ||
      !data.customer_id ||
      !data.customer_type
    ) {
      return { status: 400, message: "Missing required fields" };
    }
    const voucherRef = db.collection(table_name).doc(data.record_id);
    const doc = await voucherRef.get();

    if (!doc.exists) {
      return { status: 404, message: "Voucher record not found" };
    }

    if (data.customer_type == 1) {
      if (!isNaN(Date.parse(doc.data().start_date)) && !isNaN(Date.parse(doc.data().end_date))) {
        return { status: 400, message: "Voucher has no valid date." };
      }
      const template = doc.data().template_details;
      const customeRef = db.collection("customers").doc(data.customer_id);
      const customerdoc = await customeRef.get();
      const email = customerdoc.data().email;

      sendmail(email, 'Email Voucher from Hordanso', template);

      const newdata = {
        voucher_id: data.record_id,
        customer_id: data.customer_id,
        status: "active",
        active_date: doc.data().start_date,
        expire_date: doc.data().end_date,
        used_date: null,
        created_at: admin.firestore.FieldValue.serverTimestamp(),

      }
      const docRef = await db.collection("customer_vouchers").add(newdata);

    } else if (data.customer_type == 2) {
      const customeRef = db.collection("customer_groups").doc(data.customer_id);
      const customerdoc = await customeRef.get();
      if (customerdoc.exists) {
        let country = customerdoc.data().country;
        let region = customerdoc.data().region;
        let license_usage = customerdoc.data().license_usage;
        const customersRef = db.collection('customers');
        // Build the query with filters
        let query = customersRef;
        if (country) query = query.where('country', '==', country);
        if (region) query = query.where('state_name', '==', region);
        if (license_usage) query = query.where('customer_count', '==', Number(license_usage));

        // Execute the query
        const querySnapshot = await query.get();
        const voucherList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Collect results
        const results = [];
        const promises = querySnapshot.docs.map(async doc => {
          const newdata = {
            voucher_id: data.record_id,
            customer_id: doc.id,
            status: "active",
            active_date: doc.data().start_date,
            expire_date: doc.data().end_date,
            used_date: null,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
          };
          await db.collection("customer_vouchers").add(newdata);
          results.push(doc.data().email);
        });
        // Wait for all promises to complete 
        await Promise.all(promises);

        const emails = results.join(',');

        const template = doc.data().template_details;
        if (emails) {
          sendmail(emails, 'Email Voucher from Hordanso', template);
        }
      } else {
        return { status: 400, message: "Customer group not found" };
      }
    }


    return {
      status: 200,
      message: "Voucher email sent successfully",
    };
  } catch (error) {
    console.error("Error in email voucher:", error);
    return {
      status: 500,
      message: "Error email voucher",
      error: error.message,
    };
  }
}

module.exports = {
  getVoucherList,
  addnewvoucher,
  editvoucher,
  deletevoucher,
  sendvochermail
};