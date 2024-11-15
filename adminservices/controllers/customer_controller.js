const customerservice = require("../services/customerservice.js");

class customercontroller {
    async addCustomer(req, res) {
      try {
        const result = await  customerservice.addnewCustomer(req.body);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async editCustomer(req, res) {
      try {
        const { record_id, ...updateData } = req.body;
        const result = await  customerservice.edit_Customer(record_id, updateData);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async getCustomerList(req, res) {
      try {
        const result = await  customerservice.getCustomerList();
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async deleteCustomer(req, res) {
      try {
        const { record_id } = req.body;
        const result = await  customerservice.delete_customer(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async suspendCustomer(req, res) {
      try {
        const { record_id } = req.body;
        const result = await  customerservice.suspend_customer(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async cancelSubscription(req, res) {
      try {
        const { record_id } = req.body;
        const result = await  customerservice.cancel_subscription(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }


    
  }

    module.exports = new customercontroller();