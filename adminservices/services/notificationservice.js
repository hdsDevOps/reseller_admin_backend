const { db } = require('../firebaseConfig');
const { sendEmail } = require('../utils/emailService');
// const { sendEmail } = require('../utils/emailService'); 

class NotificationService {
  async getNotificationList() {
    try {
      const templatesRef = db.collection('notification_templates');
      const snapshot = await templatesRef.get();
      const templates = [];
      
      snapshot.forEach(doc => {
        templates.push({ id: doc.id, ...doc.data() });
      });

      return {
        status: 'success',
        data: templates
      };
    } catch (error) {
      throw new Error('Failed to fetch notification templates: ' + error.message);
    }
  }

  async getTemplateDetails(record_id) {
    try {
      const templateRef = db.collection('notification_templates').doc(record_id);
      const template = await templateRef.get();

      if (!template.exists) {
        throw new Error('Template not found');
      }

      return {
        status: 'success',
        data: { id: template.id, ...template.data() }
      };
    } catch (error) {
      throw new Error('Failed to fetch template details: ' + error.message);
    }
  }

  async updateTemplate(record_id, template_content) {
    try {
      const templateRef = db.collection('notification_templates').doc(record_id);
      
      const template = await templateRef.get();
      if (!template.exists) {
        throw new Error('Template not found');
      }

      await templateRef.update({
        template_content,
        updated_at: new Date()
      });

      return {
        status: 'success',
        message: 'Template updated successfully'
      };
    } catch (error) {
      throw new Error('Failed to update template: ' + error.message);
    }
  }

  async sendTestEmail(email_ids, record_id) {
    try {
      // First get the template
      const templateRef = db.collection('notification_templates').doc(record_id);
      const template = await templateRef.get();

      if (!template.exists) {
        throw new Error('Template not found');
      }

      const templateData = template.data();

      // Send email to each recipient
      const emailPromises = email_ids.map(email =>
        sendEmail({
          to: email,
          subject: templateData.subject || 'Test Email',
          html: templateData.template_content,
        })
      );

      await Promise.all(emailPromises);

      return {
        status: 'success',
        message: 'Test emails sent successfully'
      };
    } catch (error) {
      throw new Error('Failed to send test emails: ' + error.message);
    }
  }

  async addTemplate(template_header) {
    try {
      console.log(template_header);
      const templatesRef = db.collection('notification_templates');
      await templatesRef.add({
        template_header,
        created_at: new Date()
      });
  
      return {
        status: 'success',
        message: 'New template add successfully'
      };
    } catch (error) {
      throw new Error('Failed to update template: ' + error.message);
    }
  }

  async sendTestEmail(email_ids, record_id) {
    try {
      // First get the template
      const templateRef = db.collection('notification_templates').doc(record_id);
      const template = await templateRef.get();

      if (!template.exists) {
        throw new Error('Template not found');
      }

      const templateData = template.data();

      // Send email to each recipient
      const emailPromises = email_ids.map(email =>
        sendEmail({
          to: email,
          subject: templateData.subject || 'Test Email',
          html: templateData.template_content,
        })
      );

      await Promise.all(emailPromises);

      return {
        status: 'success',
        message: 'Test emails sent successfully'
      };
    } catch (error) {
      throw new Error('Failed to send test emails: ' + error.message);
    }
  }

  async sendmailtocustomer(email_ids, record_id) {
    try {
      // First get the template
      const templateRef = db.collection('notification_templates').doc(record_id);
      const template = await templateRef.get();

      if (!template.exists) {
        throw new Error('Template not found');
      }

      const templateData = template.data();


      // Send email to each recipient
      const emailPromises = email_ids.map(email =>
        sendEmail({
          to: email,
          subject: templateData.template_header || 'Test Email',
          html: templateData.template_content,
        })
      );

      await Promise.all(emailPromises);

      return {
        status: 'success',
        message: 'Test emails sent successfully'
      };
    } catch (error) {
      throw new Error('Failed to send test emails: ' + error.message);
    }
  }

  async getemaillogs() {
    try {
      const emaillogRef = db.collection('email_logs');
      const snapshot = await emaillogRef.get();
      const emaillogs = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
  emaillogs.push({
    id: doc.id,
    ...data,
    created_at: data.created_at ? data.created_at.toDate() : null // Convert to Date if exists
  });
      });

      return {
        status: 'success',
        data: emaillogs
      };
    } catch (error) {
      throw new Error('Failed to fetch email log details: ' + error.message);
    }
  }

  getNotificationSettingsService = async (userId) => {
    const settingsDoc = await db.collection('notification_settings').doc(userId).get();
    return settingsDoc.exists ? settingsDoc.data() : null;
};

  updateNotificationStatusService = async (userId, status) => {
    const userRef = db.collection('notification_settings').doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        // If no record exists, create a new one
        const newSettings = {
            userId,
            status,
            createdAt: new Date().toISOString(),
        };
        await userRef.set(newSettings);
    } else {
        // Update existing record
        await userRef.update({
            status,
            updatedAt: new Date().toISOString(),
        });
      }
    };
}

module.exports = new NotificationService();