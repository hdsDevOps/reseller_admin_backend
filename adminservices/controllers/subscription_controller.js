const subscriptionService = require("../services/subscriptionservice");


class SubscriptionController {
  async getPaymentMethods(req, res) {
    try {
      const result = await subscriptionService.getPaymentMethods();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async updatePaymentMethodStatus(req, res) {
    try {
      const { record_id, status } = req.body;
      const result = await subscriptionService.updatePaymentMethodStatus(record_id, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getPlansList(req, res) {
    try {
      const result = await subscriptionService.getPlansList();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async addNewPlan(req, res) {
    try {
      const result = await subscriptionService.addNewPlan(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async deletePlan(req, res) {
    try {
      const { record_id } = req.body;
      const result = await subscriptionService.deletePlan(record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async editPlan(req, res) {
    try {
      const result = await subscriptionService.editPlan(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new SubscriptionController();