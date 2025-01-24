const { admin, db } = require("../firebaseConfig");
const helper = require("../helper");

class CustomerService {
  async addCustomer(customerData) {
    try {
      const docRef = await db.collection("customers").add(customerData);
      return {
        status: 200,
        message: "Customer added successfully",
        customerId: docRef.id,
      };
    } catch (error) {
      return {
        status: 400,
        message: "Error adding customer",
        error: error.message,
      };
    }
  }

  async getCustomer(customerId) {
    try {
      const doc = await db.collection("customers").doc(customerId).get();
      if (!doc.exists) {
        throw new Error("Customer not found");
      }
      return { status: 200, customer: doc.data() };
    } catch (error) {
      return {
        status: 400,
        message: "Error getting customer",
        error: error.message,
      };
    }
  }
  async getCustomerDomain(customerId) {
    try {
      let domain = [];
      let domains_data = [];
      domain = await db.collection("domains").where("customer_id", "==", customerId).where("is_deleted", "==", false).get();

      domains_data = domain.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { status: 200, data: domains_data };
    } catch (error) {
      return {
        status: 400,
        message: "Error getting customer",
        error: error.message,
      };
    }
  }

  async sendNotification(customerId, message) {
    try {
      const customerDoc = await db
        .collection("customers")
        .doc(customerId)
        .get();
      if (!customerDoc.exists) {
        throw new Error("Customer not found");
      }
      const customerEmail = customerDoc.data().email;
      await helper.sendMail(customerEmail, "Notification", message);
      return { status: 200, message: "Notification sent successfully" };
    } catch (error) {
      return {
        status: 400,
        message: "Error sending notification",
        error: error.message,
      };
    }
  }

  async editCustomer(customerId, updateData) {
    try {
      await db.collection("customers").doc(customerId).update(updateData);
      return { status: 200, message: "Customer updated successfully" };
    } catch (error) {
      return {
        status: 400,
        message: "Error updating customer",
        error: error.message,
      };
    }
  }

  async deleteCustomer(customerId) {
    try {
      await db.collection("customers").doc(customerId).delete();
      return { status: 200, message: "Customer deleted successfully" };
    } catch (error) {
      return {
        status: 400,
        message: "Error deleting customer",
        error: error.message,
      };
    }
  }

  async cancelSubscription(customerId) {
    try {
      await db.collection("customers").doc(customerId).update({
        subscriptionStatus: "cancelled",
      });
      return { status: 200, message: "Subscription cancelled successfully" };
    } catch (error) {
      return {
        status: 400,
        message: "Error cancelling subscription",
        error: error.message,
      };
    }
  }

  async suspendAccount(customerId) {
    try {
      await db.collection("customers").doc(customerId).update({
        accountStatus: "suspended",
      });
      return { status: 200, message: "Account suspended successfully" };
    } catch (error) {
      return {
        status: 400,
        message: "Error suspending account",
        error: error.message,
      };
    }
  }

  async transferAccount(customerId, newOwnerId) {
    try {
      // Implement the logic for transferring an account
      // This might involve updating ownership information and other relevant data
      return { status: 200, message: "Account transferred successfully" };
    } catch (error) {
      return {
        status: 400,
        message: "Error transferring account",
        error: error.message,
      };
    }
  }

  async getAllCustomers(page, limit) {
    try {
      const customersRef = db.collection("customers");
      const snapshot = await customersRef.get();
      const totalCount = snapshot.size;

      const startAt = (page - 1) * limit;
      const customersQuery = customersRef
        .orderBy("name")
        .offset(startAt)
        .limit(limit);
      const customersSnapshot = await customersQuery.get();

      const customers = [];
      customersSnapshot.forEach((doc) => {
        customers.push({
          id: doc.id,
          customer_id: "HDS-" + doc.customer_count,
          //...doc.data(),
        });
      });

      return {
        status: 200,
        customers: customers,
        totalCount: totalCount,
        page: page,
        limit: limit,
      };
    } catch (error) {
      return {
        status: 400,
        message: "Error retrieving customers",
        error: error.message,
      };
    }
  }

  async addnewCustomer({
    first_name,
    last_name,
    address,
    state,
    city,
    country,
    zipcode,
    phone_no,
    email,
    authentication,
  }) {

    try {
      const customersRef = db.collection("customers");

      const checkcustomerexist = await db.collection('customers')
        .where('email', '==', email)
        .get();
      if (checkcustomerexist.empty) {
        // Fetch all documents in the 'customers' collection
        const snapshot = await customersRef.get();

        const recordCount = snapshot.size;
        const password = "12345678";
        let currentCount = recordCount + 1;
        const customerRef = await db.collection("customers").add({
          first_name,
          last_name,
          address,
          state,
          city,
          country,
          zipcode,
          phone_no,
          email,
          authentication,
          status: "active",
          account_status: "active",
          created_at: new Date(),
          customer_count: currentCount,
          searchableIndex: [first_name.toLowerCase(), last_name.toLowerCase(), `${first_name.toLowerCase()} ${last_name.toLowerCase()}`, email.toLowerCase(), "", phone_no,],
        });
        await admin.auth().createUser({
          email: email,
          password: password,
        });
        return {
          status: 200,
          message: "Customer added successfully",
          customerId: customerRef.id,
        };
      } else {
        return {
          status: 400,
          message: "Customer already exist",
        };
      }
    } catch (error) {
      throw new Error("Failed to add customer: " + error.message);
    }
  }

  async edit_Customer(record_id, updateData) {
    try {
      let exist_status = 0;
      let data = {};
      const checkcustomerexist = await db.collection('customers')
        .where('email', '==', updateData.email)
        .get();

      checkcustomerexist.forEach(doc => {
        if (doc.id == record_id) {
          exist_status = 1;

        }
      });

      let searchableIndex = [];
      if (updateData.hasOwnProperty('first_name')) {
        searchableIndex.push(updateData.first_name.toLowerCase());
      }
      if (updateData.hasOwnProperty('last_name')) {
        searchableIndex.push(updateData.last_name.toLowerCase());
      }
      if (updateData.hasOwnProperty('last_name')) {
        searchableIndex.push(`${updateData.first_name.toLowerCase()} ${updateData.last_name.toLowerCase()}`);
      }
      if (updateData.hasOwnProperty('email')) {
        searchableIndex.push(updateData.email.toLowerCase());
      }
      if (updateData.hasOwnProperty('business_phone_number')) {
        searchableIndex.push(updateData.business_phone_number.toLowerCase());
      }
      if (updateData.hasOwnProperty('phone_no')) {
        searchableIndex.push(updateData.phone_no.toLowerCase());
      }




      if (exist_status == 1) {
        await db
          .collection("customers")
          .doc(record_id)
          .update({
            ...updateData,
            searchableIndex: [updateData.first_name.toLowerCase(), updateData.last_name.toLowerCase(), `${updateData.first_name.toLowerCase()} ${updateData.last_name.toLowerCase()}`, updateData.email.toLowerCase(), "", updateData.phone_no,],
            updated_at: new Date(),
          });

        return {
          status: 200,
          message: "Customer updated successfully",
        };
      } else {
        return {
          status: 400,
          message: "Customer not exist",
        };
      }
    } catch (error) {
      throw new Error("Failed to update customer: " + error.message);
    }
  }
  async edit_Customer_password(record_id, updateData) {
    try {

      await db
        .collection("customers")
        .doc(record_id)
        .update({
          ...updateData,
          updated_at: new Date(),
        });

      return {
        status: 200,
        message: "Customer updated successfully",
      };

    } catch (error) {
      throw new Error("Failed to update customer: " + error.message);
    }
  }

  // async getCustomerList(data) {
  //   try {
  //     const searchKey = data.search_data;
  //     const customersRef = db.collection('customers');

  //     // Queries for partial matches on firstname, lastname, and email
  //     let query = db.collection('customers');


  //     if (data.domain && data.domain.trim() !== "") {
  //       query = query.where('domain', '==', data.domain);
  //     }
  //     // Add filters dynamically based on available data
  //     if (data.country && data.country.trim() !== "") {
  //       query = query.where('country', '==', data.country);
  //     }

  //     if (data.state_name && data.state_name.trim() !== "") {
  //       query = query.where('state_name', '==', data.state_name);
  //     }

  //     if (data.authentication !== "" && data.authentication !== undefined) {
  //       if (data.authentication == true) {

  //         query = query.where("authentication", "==", true);
  //       } else {

  //         query = query.where("authentication", "==", false);
  //       }
  //     }

  //     // Add sorting and search functionality
  //     query = query
  //       .orderBy('first_name')
  //       .startAt(searchKey)
  //       .endAt(searchKey + '\uf8ff');

  //     // Fetch the records
  //     const firstnameQuery = await query.get();

  //     query = customersRef;

  //     if (data.domain && data.domain.trim() !== "") {
  //       query = query.where('domain', '==', data.domain);
  //     }
  //     // Add filters dynamically based on available data
  //     if (data.country && data.country.trim() !== "") {
  //       query = query.where('country', '==', data.country);
  //     }

  //     if (data.state_name && data.state_name.trim() !== "") {
  //       query = query.where('state_name', '==', data.state_name);
  //     }

  //     if (data.authentication !== undefined) { query = query.where("authentication", "==", data.authentication); }

  //     // Add sorting and search
  //     query = query
  //       .orderBy('last_name')
  //       .startAt(searchKey)
  //       .endAt(searchKey + '\uf8ff');

  //     // Execute the query
  //     const lastnameQuery = await query.get();



  //     query = customersRef;

  //     if (data.domain && data.domain.trim() !== "") {
  //       query = query.where('domain', '==', data.domain);
  //     }
  //     // Add filters dynamically based on available data
  //     if (data.country && data.country.trim() !== "") {
  //       query = query.where('country', '==', data.country);
  //     }

  //     if (data.state_name && data.state_name.trim() !== "") {
  //       query = query.where('state_name', '==', data.state_name);
  //     }

  //     if (data.authentication !== undefined) { query = query.where("authentication", "==", data.authentication); }

  //     // Add sorting and search functionality
  //     query = query
  //       .orderBy('email')
  //       .startAt(searchKey)
  //       .endAt(searchKey + '\uf8ff');

  //     // Execute the query
  //     const emailQuery = await query.get();


  //     // Execute all queries in parallel
  //     const [firstnameSnap, lastnameSnap, emailSnap] = await Promise.all([firstnameQuery, lastnameQuery, emailQuery]);

  //     // Combine results into a Map to avoid duplicates
  //     const results = new Map();

  //     firstnameSnap.forEach(doc => results.set(doc.id, { id: doc.id, ...doc.data() }));
  //     lastnameSnap.forEach(doc => results.set(doc.id, { id: doc.id, ...doc.data() }));
  //     emailSnap.forEach(doc => results.set(doc.id, { id: doc.id, ...doc.data() }));

  //     // Convert Map to an array of unique customers
  //     const uniqueCustomers = Array.from(results.values());

  //     //const snapshot = await db.collection("customers").get();

  //     const customers = [];
  //     for (const customer of uniqueCustomers) {

  //       // let subscriptionData = null;
  //       // let last_payment = "";
  //       // const subscriptionRef = db.collection('customer_subscriptions').where('customer_id', '==', customer.id).orderBy('last_payment', 'desc').limit(1);
  //       // const subscriptionSnap = await subscriptionRef.get();
  //       // if (!subscriptionSnap.empty) {
  //       //   subscriptionData = subscriptionSnap.docs[0].data();
  //       // }

  //       // if (subscriptionData) {
  //       //   last_payment = subscriptionData.last_payment;
  //       // }
  //       let profile_id = customer.profile_id ? customer.profile_id : "";
  //       customers.push({
  //         record_id: customer.id,
  //         customer_id: profile_id,
  //         ...customer,          
  //       });
  //     }
  //     return {
  //       status: 200,
  //       data: customers,
  //     };
  //   } catch (error) {
  //     throw new Error("Failed to fetch customers: " + error.message);
  //   }
  // }

  async getCustomerList(data) {
    try {

      let query = db
        .collection("customers");
      if (data.country != "" && data.country != null) {
        query = query.where("country", "==", data.country);
      }

      if (data.state != "" && data.state != null) {
        query = query.where("state", "==", data.state);
      }

      if (data.authentication !== "" && data.authentication !== null && data.authentication !== undefined) {
        if (data.authentication === true) {
          query = query.where("authentication", "==", true);
        } else {
          query = query.where("authentication", "==", false);
        }
      }

      if (data.license_usage != "" && data.license_usage != null) {
        query = query.where("license_usage", "==", data.license_usage);
      }

      if (data.subscription_date.start_date != "" && data.subscription_date.end_date != "") {
        query = query.where("workspace.subscription_date", ">=", new Date(data.subscription_date.start_date)).where("workspace.subscription_date", "<=", new Date(data.subscription_date.end_date));
      }
      if (data.renewal_date.start_date != "" && data.renewal_date.end_date != "") {
        query = query.where("workspace.next_payment", ">=", new Date(data.renewal_date.start_date)).where("workspace.next_payment", "<=", new Date(data.renewal_date.end_date));
      }
      if (data.domain && data.domain.trim() !== "") {
        const domainName = data.domain.toLowerCase();

        const domainRef = db.collection('domains');
        const domainSnapshot = await domainRef.where('domain_name', '==', domainName).get();
        if (domainSnapshot.empty) {
          return { status: 200, message: 'No matching domains found.' };
        }
        let customerId;
        domainSnapshot.forEach(doc => {
          customerId = doc.data().customer_id;
          const customerDocRef = db.collection('customers').doc(customerId);
          query = query.where('__name__', '==', customerDocRef.id);
        });

        //query = query.doc(customerId);
      }

      let orderType = "";
      if (data.hasOwnProperty("sortdata") && data.sortdata != "") {
        const sortdata = data.sortdata;
        orderType = sortdata.order;
        if (sortdata != "" && sortdata.sort_text == "next_payment") {
          query = query.orderBy("workspace.next_payment", orderType);
        }
        if (sortdata != "" && sortdata.sort_text == "createdAt") {
          query = query.orderBy("createdAt", orderType);
        }
        if (sortdata != "" && sortdata.sort_text == "license_usage") {
          query = query.orderBy("license_usage", orderType);
        }

      }



      query = query.orderBy("createdAt", "desc");
      const custSnapshot = await query.get();

      let search_text = data.search_data;
      let custList = [];
      custSnapshot.forEach((doc) => {
        const data = doc.data();
        const fullName = `${data.first_name} ${data.last_name}`;
        if (search_text != "" && search_text != null) {
          const searchText = search_text.toLowerCase();

          if (data.searchableIndex && data.searchableIndex.some((entry) => entry.toLowerCase().includes(searchText.toLowerCase()))) {

            custList.push({ id: doc.id, fullName, ...data, created_at: doc.data().created_at ? doc.data().created_at.toDate() : null, });
          }
        } else {
          custList.push({ id: doc.id, fullName, ...data, created_at: doc.data().created_at ? doc.data().created_at.toDate() : null, });
        }
        if (data.hasOwnProperty("sortdata") && data.sortdata != "") {
          if (sortdata != "" && sortdata.sort_text == "name") {
            custList.sort((a, b) => a.fullName.localeCompare(b.fullName));
          }
          if (sortdata != "" && sortdata.sort_text == "domain") {
            custList.sort((a, b) => a.domain.localeCompare(b.domain));
          }
        }
      });




      return {
        status: 200,
        message: "customer list retrieved successfully",
        data: custList,
      };

    } catch (error) {
      throw new Error("Failed to fetch customers: " + error.message);
    }
  }
  async delete_customer(record_id) {
    try {
      await db.collection("customers").doc(record_id).delete();
      return {
        status: 200,
        message: "Customer deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete customer: " + error.message);
    }
  }

  async suspend_customer(record_id) {
    try {
      await db.collection("customers").doc(record_id).update({
        status: false,
        account_status: "suspended",
        suspended_at: new Date(),
      });

      return {
        status: 200,
        message: "Customer suspended successfully",
      };
    } catch (error) {
      throw new Error("Failed to suspend customer: " + error.message);
    }
  }

  async cancel_subscription(record_id) {
    try {
      await db.collection("customers").doc(record_id).update({
        subscription_status: "cancelled",
        status: false,
        cancelled_at: new Date(),
      });

      return {
        status: 200,
        message: "Customer subscription cancelled successfully",
      };
    } catch (error) {
      throw new Error(
        "Failed to cancel customer subscription: " + error.message
      );
    }
  }

  async active_subscription(record_id) {
    try {
      await db.collection("customers").doc(record_id).update({
        status: true,
        subscription_status: "active",
        cancelled_at: new Date(),
      });

      return {
        status: 200,
        message: "Customer subscription active successfully",
      };
    } catch (error) {
      throw new Error(
        "Failed to active customer subscription: " + error.message
      );
    }
  }

  async getgroupcustomernumber(data) {
    try {

      const customerCollection = db.collection("customers");

      const filters = {
        country: data.country, // Set to null/undefined if not needed
        state_name: data.state, // Set to null/undefined if not needed
        customer_count: data.license_usage,
        plan: data.plan,
        start_date: data.start_date,
        end_date: data.end_date,
      };

      // Start the base query
      let query = customerCollection;
      query = query.where("account_status", "==", "active");

      // Add dynamic filters
      if (filters.country) {
        query = query.where("country", "==", filters.country);
      }
      if (filters.state_name) {
        query = query.where("state_name", "==", filters.state_name);
      }

      if (filters.customer_count) {
        query = query.where("customer_count", "==", filters.customer_count);
      }
      if (filters.plan) {
        query = query.where("plan", "==", filters.plan);
      }
      if (filters.start_date) {
        query = query.where("start_date", "==", filters.start_date);
      }
      if (filters.end_date) {
        query = query.where("end_date", "==", filters.end_date);
      }

      // Execute the query
      const querySnapshot = await query.get();

      const customers = [];
      querySnapshot.forEach(doc => {
        customers.push({ id: doc.id, ...doc.data() });
      });

      return { status: 200, customer_count: customers.length, message: "Total customer count against filter" };
    } catch (error) {
      return {
        status: 400,
        message: "Error sending notification",
        error: error.message,
      };
    }
  }

  async getcountrylist() {
    try {

      const customerCollection = db.collection("customers");
      // Start the base query
      let query = customerCollection;
      query = query.where("account_status", "==", "active");

      // Execute the query
      const querySnapshot = await query.get();

      const countrylist = [];
      querySnapshot.forEach(doc => {
        const data = doc.data(); // Get the document data
        if (data.country) { // Check if the country field exists
          countrylist.push(data.country);
        }
      });
      console.log("object========countrylist=========", countrylist);
      const uniquecountrylist = [...new Set(countrylist)];
      return { status: 200, countrylist: uniquecountrylist, message: "Country List for customer" };
    } catch (error) {
      return {
        status: 400,
        message: "Error sending notification",
        error: error.message,
      };
    }
  }

  async getregionlist(data) {
    try {

      const customerCollection = db.collection("customers");
      // Start the base query
      let query = customerCollection;
      query = query.where("account_status", "==", "active");

      // Execute the query
      const querySnapshot = await query.get();

      const regionlist = [];
      querySnapshot.forEach(doc => {
        const data = doc.data(); // Get the document data
        if (data.state_name) { // Check if the country field exists
          regionlist.push(data.state_name);
        }
      });

      const uniqueregionlist = [...new Set(regionlist)];

      return { status: 200, regionlist: uniqueregionlist, message: "Region List for customer" };
    } catch (error) {
      return {
        status: 400,
        message: "Error sending notification",
        error: error.message,
      };
    }
  }

  async getCustomerbyemail(email) {
    try {
      const checkcustomerexist = await db.collection('customers')
        .where('email', '==', email)
        .get();
      if (checkcustomerexist.empty) {
        return {
          status: 400,
          message: "Customer not found",
        };
      } else {
        return {
          status: 200,
          message: "Customer found",
          data: checkcustomerexist.docs[0].data(),
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: "Error getting customer",
        error: error.message,
      };
    }
  }
  async getDomainList(data) {
    try {


      let query = db.collection("domains");
      query = query.where("domain_status", "==", true).where("is_deleted", "==", false);
      if (data.hasOwnProperty("customer_id") && data.customer_id != "") {
        query = query.where("customer_id", "==", data.customer_id);
      }
      const querySnapshot = await query.get();
      // Start the base query


      // Execute the query

      const domainlist = [];
      let search_text = data.search_text;

      querySnapshot.forEach(doc => {
        const data = doc.data(); // Get the document data     
        if (search_text != "" && search_text != null) {
          const searchText = search_text.toLowerCase();
          if (data.searchableIndex && data.searchableIndex.some((entry) => entry.toLowerCase().includes(searchText.toLowerCase()))) {

            domainlist.push({ id: doc.id, ...data, created_at: doc.data().created_at ? doc.data().created_at.toDate() : null, });
          }
        } else {
          domainlist.push({ id: doc.id, ...data, created_at: doc.data().created_at ? doc.data().created_at.toDate() : null, });
        }

      });



      return { status: 200, domainlist: domainlist, message: "domain List for customer" };
    } catch (error) {
      return {
        status: 400,
        message: "Error sending notification",
        error: error.message,
      };
    }
  }
  async updateDomain() {
    const batch = db.batch();


    const customersRef = db.collection('customers');
    // try {
    const snapshot = await customersRef.get();

    snapshot.forEach(async doc => {
      const data = doc.data();
      // const custRef = db.collection('customers').doc(data.customer_id);
      // const custData = await custRef.get();
      // const custDataValue = custData.data();     
      // if(custDataValue.domain=="" || custDataValue.domain==null || custDataValue.domain==undefined){
      //   const domainRef = db.collection('customers').doc(data.customer_id);
      //   domainRef.update({ domain: data.domain_name });

      // }
      const fields = [data.first_name?.toLowerCase(), data.last_name?.toLowerCase(), `${data.first_name?.toLowerCase()} ${data.last_name?.toLowerCase()}`, data.email?.toLowerCase(), data.business_phone_number, data.domain];
      const availableData = fields.filter(field => field !== undefined);
      const searchableIndex = availableData;//for customer
      // const searchableIndex = data.domain_name ? [data.domain_name.toLowerCase()] : [];//for domain

      const docRef = customersRef.doc(doc.id);
      batch.update(docRef, { searchableIndex });
    });
    await batch.commit();
    console.log('Documents updated successfully.');
    // } catch (error) {
    //   console.error('Error updating documents:', error);
    // }
  }
  async getEmaillist(request) {
    try {


      let query = db.collection("domains");
      query = query.where("domain_type", "==", "primary");
      if (request.hasOwnProperty("customer_id") && request.customer_id != "") {
        query = query.where("customer_id", "==", request.customer_id);
      }
      const querySnapshot = await query.get();
      // Start the base query


      // Execute the query

      const emaillist = [];

      querySnapshot.forEach(doc => {
        const data = doc.data(); // Get the document data 
        emaillist.push({ ...data.emails });


      });



      return { status: 200, emaillist: emaillist, message: "email List for customer" };
    } catch (error) {
      return {
        status: 400,
        message: "Error sending email list",
        error: error.message,
      };
    }
  }
}

module.exports = new CustomerService();
