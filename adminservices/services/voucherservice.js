const { db } = require('../firebaseConfig');

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





      const checkgroupref = await db.collection("customer_groups").get();

      let exists = checkgroupref.docs.some(doc => doc.data().group_name.toLowerCase() === group_name.toLowerCase());
      let message = "";
      if (exists) {
        message += "Duplicate group name."
      }
      if (no_customer <= 0) {
        message += "Customer no should be above 0";
      }

      if (exists || no_customer <= 0) {
        return { status: 410, message: message }
      }



      const groupRef = await db.collection("customer_groups").add({
        group_name,
        group_name_lower: group_name.toLowerCase(),
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
      updateData.group_name_lower = updateData.group_name.toLowerCase();
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

  async getCustomerGroupList(data) {
    try {
      let query = db.collection("customer_groups");
      const filter = {
        group_name: data.group_name.toLowerCase(), // The group name to search for
        create_date: data.create_date, // The creation date to search for
      };
      const start = data.group_name.toLowerCase();
      const end = data.group_name.toLowerCase() + '\uf8ff';
      // Filter by group_name if provided
      if (filter.group_name) {

        //query = query.where("group_name_lower", "==", filter.group_name);
        query = query.where("group_name_lower", ">=", start)
        query = query.where("group_name_lower", "<=", end)

      }
      // Filter by create_date if provided
      if (filter.create_date) {
        const startOfDay = new Date(filter.create_date);
        startOfDay.setHours(0, 0, 0, 0); // Start of the day
        const endOfDay = new Date(filter.create_date);
        endOfDay.setHours(23, 59, 59, 999); // End of the day
        query = query.where("created_at", ">=", startOfDay).where("created_at", "<=", endOfDay);
      }
      query = query.orderBy("created_at", "desc")
      // Execute the query
      const snapshot = await query.get();
      // Collect the results
      const groups = snapshot.docs.map((doc) => ({
        record_id: doc.id,
        ...doc.data(),
        no_customer: Number(doc.data().no_customer),
        create_date: doc.data().created_at ? doc.data().created_at.toDate() : null,
      }));
      if (data.sortdata) {
        if (data.sortdata.sort_text && data.sortdata.sort_text != "")
          if (data.sortdata.order == "asc") {
            groups.sort((a, b) => {
              if (a.no_customer < b.no_customer) {
                return -1;
              }
              if (a.no_customer > b.no_customer) {
                return 1;
              }
              return 0;
            });
          }
        if (data.sortdata.order == "desc") {
          groups.sort((a, b) => {
            if (a.no_customer < b.no_customer) {
              return 1;
            }
            if (a.no_customer > b.no_customer) {
              return -1;
            }
            return 0;
          });
        }
      }

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
