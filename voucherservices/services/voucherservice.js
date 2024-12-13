const { admin, db } = require("../firebaseConfig");
const { sendmail } = require("../helper");
const helper = require('../helper');
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
        query = query.where("voucher_code", "==", filter.voucher_code);
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
      const voucherSnapshot = await query.get();
      
      const voucherList = voucherSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        //start_date: doc.data().start_date ? doc.data().start_date.toDate() : null,
        //end_date: doc.data().end_date ? doc.data().end_date.toDate() : null,
        //created_at: doc.data().created_at ? doc.data().created_at.toDate() : null,
        //updated_at: doc.data().updated_at ? doc.data().updated_at.toDate() : null,
      }));
  if(voucherSnapshot.empty){
    return {
        status: 200,
        message: "No voucher record found",
        data: [],
      };
  }else{  
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

  
      // Create new staff document
      const newStaff = {
        voucher_code: data.voucher_code,
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
  
        const voucherRef = db.collection(table_name).doc(data.record_id);
            const doc = await voucherRef.get();

            if (!doc.exists) {
            return { status: 404, message: "Voucher record not found" };
            }

            await voucherRef.update({
                voucher_code: data.voucher_code,
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
          
      if(data.customer_type == 1){  
        const customeRef = db.collection("customers").doc(data.customer_id);
        const customerdoc = await customeRef.get();    
        const email = customerdoc.data().email;
        const template = doc.data().template_details;
        sendmail(email, 'Email Voucher from Hordanso', template);
        
      }else if(data.customer_type == 2){
        const customeRef = db.collection("customer_groups").doc(data.customer_id);
        const customerdoc = await customeRef.get();    
        let country = customerdoc.data().country;
        let region = customerdoc.data().region;
        let license_usage = customerdoc.data().license_usage;

        const customersRef = db.collection('customers');
        // Build the query with filters
        let query = customersRef;
        if (country) query = query.where('country', '==', country);
        if (region) query = query.where('state_name', '==', region);
        if (license_usage) query = query.where('customer_count', '==', license_usage);

        // Execute the query
        const querySnapshot = await query.get();
        

        // Collect results
        const results = [];
        querySnapshot.forEach(doc => {
          results.push(doc.data().email);
        });
        const emails = results.join(',');
        const template = doc.data().template_details;
        sendmail(emails, 'Email Voucher from Hordanso', template);
      }

        
        return {
          status: 200,
          message: "Voucher email sent successfully",
        };
      } catch (error) {
        console.error("Error in email voucher:", error);
        return {
          status: 500,
          message: "Error emil voucher",
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