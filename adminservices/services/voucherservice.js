const { db } = require('../firebaseconfig');

class VoucherService {

  async createCustomerGroup({
    group_name,
    country,
    region,
    plan,
    start_date,
    end_date,
    license_usage,
    no_customer,
  }) {
    try {
      const groupRef = await db.collection("customer_groups").add({
        group_name,
        country,
        region,
        plan,
        start_date,
        end_date,
        license_usage,
        no_customer,
        created_at: new Date(),
      });
      
      return {
        status: 200,
        message: "Customer group created successfully",
        groupId: groupRef.id,
      };
    } catch (error) {
      throw new Error("Failed to create customer group: " + error.message);
    }
  }

  async editCustomerGroup(record_id, updateData) {
    try {
      await db
        .collection("customer_groups")
        .doc(record_id)
        .update({
          ...updateData,
          updated_at: new Date(),
        });

      return {
        status: 200,
        message: "Customer group updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update customer group: " + error.message);
    }
  }

  async getCustomerGroupList() {
    try {
      const snapshot = await db.collection("customer_groups").get();
      const groups = [];
      snapshot.forEach((doc) => {
        groups.push({
          record_id: doc.id,
          ...doc.data(),
        });
      });

      return {
        status: 200,
        data: groups,
      };
    } catch (error) {
      throw new Error("Failed to fetch customer groups: " + error.message);
    }
  }

  async deleteCustomerGroup(record_id) {
    try {
      await db.collection("customer_groups").doc(record_id).delete();
      return {
        status: 200,
        message: "Customer group deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete customer group: " + error.message);
    }
  }
}

module.exports = new VoucherService();
