// const { admin, db } = require("../firebaseConfig");
// const { sendmail } = require("../helper");
// const helper = require('../helper');
// const table_name = "vouchers";

// async function getVoucherList() {
//     try {
//       let query = db
//         .collection(table_name)
//         .where("is_deleted", "==", 1);
  
//       // Search functionality if search_text is provided
     
      
//       const voucherSnapshot = await query.get();
     
//       const voucherList = voucherSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         created_at: doc.data().created_at ? doc.data().created_at.toDate() : null,
//       }));
//   if(voucherSnapshot.empty){
//     return {
//         status: 200,
//         message: "No voucher record found",
//         data: [],
//       };
//   }else{  
//       return {
//         status: 200,
//         message: "Voucher list retrieved successfully",
//         data: voucherList,
//       };
//     }
//     } catch (error) {
//       console.error("Error in getVoucherList:", error);
//       return {
//         status: 500,
//         message: "Error retrieving voucher list",
//         error: error.message,
//       };
//     }
//   }

//   async function addnewvoucher(data) {
//     try {
//       // Input validation
//       if (
//         !data.voucher_code ||
//         !data.start_date ||
//         !data.end_date ||
//         !data.discount_rate ||
//         !data.template_details ||
//         !data.currency
//       ) {
//         return { status: 400, message: "Missing required fields" };
//       }

  
//       // Create new staff document
//       const newStaff = {
//         voucher_code: data.voucher_code,
//         start_date: data.start_date,
//         end_date: data.end_date,
//         discount_rate: data.discount_rate,
//         template_details: data.template_details,
//         currency: data.currency,
//         is_deleted: 1,
//         created_at: admin.firestore.FieldValue.serverTimestamp(),
//       };
  
//       const docRef = await db.collection(table_name).add(newStaff);
  
//       return {
//         status: 200,
//         message: "Voucher added successfully",
//         id: docRef.id,
//       };
//     } catch (error) {
//       console.error("Error in add voucher:", error);
//       return {
//         status: 500,
//         message: "Error adding voucher",
//         error: error.message,
//       };
//     }
//   }

//   async function editvoucher(data) {
//     try {
//         // Input validation
//         if (
//           !data.voucher_code ||
//           !data.start_date ||
//           !data.end_date ||
//           !data.discount_rate ||
//           !data.template_details ||
//           !data.currency ||
//           !data.record_id
//         ) {
//           return { status: 400, message: "Missing required fields" };
//         }
  
//         const voucherRef = db.collection(table_name).doc(data.record_id);
//             const doc = await voucherRef.get();

//             if (!doc.exists) {
//             return { status: 404, message: "Voucher record not found" };
//             }

//             await voucherRef.update({
//                 voucher_code: data.voucher_code,
//                 start_date: data.start_date,
//                 end_date: data.end_date,
//                 discount_rate: data.discount_rate,
//                 template_details: data.template_details,
//                 currency: data.currency,
//                 updated_at: admin.firestore.FieldValue.serverTimestamp(),
//             });
    
//         return {
//           status: 200,
//           message: "Voucher updated successfully",
//         };
//       } catch (error) {
//         console.error("Error in add voucher:", error);
//         return {
//           status: 500,
//           message: "Error update voucher",
//           error: error.message,
//         };
//       }
//   }

//   async function deletevoucher(data) {
//     try {
//         // Input validation
//         if (
//           !data.record_id
//         ) {
//           return { status: 400, message: "Missing required fields" };
//         }
  
//         const voucherRef = db.collection(table_name).doc(data.record_id);
//             const doc = await voucherRef.get();

//             if (!doc.exists) {
//             return { status: 404, message: "Voucher record not found" };
//             }

//             await voucherRef.update({
//                 is_deleted: 0,
//                 updated_at: admin.firestore.FieldValue.serverTimestamp(),
//             });
    
//         return {
//           status: 200,
//           message: "Voucher deleted successfully",
//         };
//       } catch (error) {
//         console.error("Error in add voucher:", error);
//         return {
//           status: 500,
//           message: "Error delete voucher",
//           error: error.message,
//         };
//       }
//   }

//   async function sendvochermail(data) {
//     try {
//         // Input validation
//         if (
//           !data.record_id ||
//           !data.customer_id ||
//           !data.customer_type
//         ) {
//           return { status: 400, message: "Missing required fields" };
//         }
  
//         const voucherRef = db.collection(table_name).doc(data.record_id);
//             const doc = await voucherRef.get();

//             if (!doc.exists) {
//             return { status: 404, message: "Voucher record not found" };
//             }
        
//         const customeRef = db.collection("customers").doc(data.customer_id);
//         const customerdoc = await customeRef.get();    
//         const email = customerdoc.data().email;
//         const template = doc.data().template_details;
//         sendmail(email, 'Email Voucher from Hordanso', template);
//         return {
//           status: 200,
//           message: "Voucher email sent successfully",
//         };
//       } catch (error) {
//         console.error("Error in email voucher:", error);
//         return {
//           status: 500,
//           message: "Error emil voucher",
//           error: error.message,
//         };
//       }
//   }

//   module.exports = {
//     getVoucherList,
//     addnewvoucher,
//     editvoucher,
//     deletevoucher,
//     sendvochermail
//   };