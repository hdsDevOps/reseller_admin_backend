const CustomerService = require("../services/customer_service.js");

class CustomerController {
    async addCustomer(req, res) {
      try {
        const result = await CustomerService.addnewCustomer(req.body);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async editCustomer(req, res) {
      try {
        const { record_id, ...updateData } = req.body;
        const result = await CustomerService.edit_Customer(record_id, updateData);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async getCustomerList(req, res) {
      try {
        const result = await CustomerService.getCustomerList();
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async deleteCustomer(req, res) {
      try {
        const { record_id } = req.body;
        const result = await CustomerService.delete_customer(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async suspendCustomer(req, res) {
      try {
        const { record_id } = req.body;
        const result = await CustomerService.suspend_customer(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
  
    async cancelSubscription(req, res) {
      try {
        const { record_id } = req.body;
        const result = await CustomerService.cancel_subscription(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }


    
  }

    module.exports = new CustomerController();