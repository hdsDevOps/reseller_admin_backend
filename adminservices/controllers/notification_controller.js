const NotificationService = require('../services/notificationservice');

class NotificationController {
  
  async addnotificationrecord(req, res) {
    try {
      const {template_heading} = req.body;
      const result = await NotificationService.addTemplate(template_heading);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
  
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

  async sendmailtocustomer(req, res) {
    try {
      const { email_ids, record_id } = req.body;
      const result = await NotificationService.sendmailtocustomer(email_ids, record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async emaillogdetails(req, res) {
    try {
      const result = await NotificationService.getemaillogs();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getnotificationdetails(req, res) {
    try {
      const data = req.body;
      const notifications = await NotificationService.getnotificationdetails(data);
   
      res.status(200).json(notifications);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getnotificationdetails(req, res) {
    try {
      const data = req.body;
      const notifications = await NotificationService.getnotificationdetails(data);
   
      res.status(200).json(notifications);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

}

module.exports = new NotificationController();