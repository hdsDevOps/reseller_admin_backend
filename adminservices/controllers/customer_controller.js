const customerservice = require("../services/customerservice.js");
const currencyservice = require("../services/currencyservice.js");

const {hashPassword} = require("../helper");

class customercontroller {
    async addCustomer(req, res) {
      try {
        const result = await  customerservice.addnewCustomer(req.body);
        const userid = result.customerId;
        const defaultCurrency = "USD";
        await currencyservice.updateDefaultCurrencyService(userid, defaultCurrency);
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
        const search_data = req.body;
        const result = await  customerservice.getCustomerList(search_data);
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

    async activeCustomer(req, res){
      try {
        const { record_id } = req.body;
        const result = await  customerservice.active_subscription(record_id);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }

    async resetcustomerpassword(req, res){
      try {
        const { record_id,password } = req.body;
        const { salt, hash } = hashPassword(password);
        const {...updateData} = {salt, hash};
        const result = await  customerservice.edit_Customer(record_id, updateData);
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }

    async getcountrylist(req, res){
      try {
        const result = await  customerservice.getcountrylist();
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }

    async getregionlist(req, res){
      try {
        const result = await  customerservice.getregionlist();
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
      }
    }
    
  }

    module.exports = new customercontroller();