const { db } = require("../firebaseConfig");
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
          ...doc.data(),
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
    state_name,
    city,
    country,
    zipcode,
    phone_no,
    email,
    authentication,
  }) {
    try {
      const customerRef = await db.collection("customers").add({
        first_name,
        last_name,
        address,
        state_name,
        city,
        country,
        zipcode,
        phone_no,
        email,
        authentication,
        status: "active",
        created_at: new Date(),
      });

      return {
        status: 200,
        message: "Customer added successfully",
        customerId: customerRef.id,
      };
    } catch (error) {
      throw new Error("Failed to add customer: " + error.message);
    }
  }

  async edit_Customer(record_id, updateData) {
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

  async getCustomerList() {
    try {
      const snapshot = await db.collection("customers").get();
      const customers = [];
      snapshot.forEach((doc) => {
        customers.push({
          record_id: doc.id,
          ...doc.data(),
        });
      });

      return {
        status: 200,
        data: customers,
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
        status: "suspended",
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
        status: "cancelled",
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
}

module.exports = new CustomerService();
