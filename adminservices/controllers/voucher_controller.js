const voucherService = require("../services/voucher_service");

class VoucherController {
  async createCustomerGroup(req, res) {
    try {
      const result = await voucherService.createCustomerGroup(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async editCustomerGroup(req, res) {
    try {
      const { record_id, ...updateData } = req.body;
      const result = await voucherService.editCustomerGroup(
        record_id,
        updateData
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getCustomerGroupList(req, res) {
    try {
      const result = await voucherService.getCustomerGroupList();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async deleteCustomerGroup(req, res) {
    try {
      const { record_id } = req.body;
      const result = await voucherService.deleteCustomerGroup(record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}

module.exports = new VoucherController();
