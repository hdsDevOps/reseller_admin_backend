const NotificationService = require('../services/notificationService.js');

class NotificationController {
  async getNotificationList(req, res) {
    try {
      const result = await NotificationService.getNotificationList();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getTemplateDetails(req, res) {
    try {
      const { record_id } = req.body;
      const result = await NotificationService.getTemplateDetails(record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async updateTemplate(req, res) {
    try {
      const { record_id, template_content } = req.body;
      const result = await NotificationService.updateTemplate(record_id, template_content);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async sendTestEmail(req, res) {
    try {
      const { email_ids, record_id } = req.body;
      const result = await NotificationService.sendTestEmail(email_ids, record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new NotificationController();