const AdminService = require("../services/admin_service");
const { admin, db } = require("../firebaseConfig");
class AdminController {
  async login(req, res) {
    try {
      const result = await AdminService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const result = await AdminService.verifyOtp(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async resendOtp(req, res) {
    try {
      const result = await AdminService.resendOtp(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async logout(req, res) {
    try {
      console.log(req.user);
      const result = await AdminService.logout(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async addFaq(req, res) {
    try {
      const result = await AdminService.addFaq(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getFaqList(req, res) {
    try {
      const result = await AdminService.getFaqList(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async editFaq(req, res) {
    try {
      const result = await AdminService.editFaq(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async deleteFaq(req,res) {
    try {
      await db.collection("faqs").doc(req.body.record_id).delete();

        res.status(200).send({status: 200,message: "FAQ deleted successfully"});
    
    } catch (error) {
      throw new Error("Error deleting FAQ"+error);
    }
  }

  async getEmailLogList(req, res) {
    try {
      const result = await AdminService.getEmailLogList();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async getEmailLogDetails(req, res) {
    try {
      const { record_id } = req.body;
      const result = await AdminService.getEmailLogDetails(record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async updateTermsConditions(req, res) {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }
      const result = await AdminService.updateTermsConditions(content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePrivacyPolicy(req, res) {
    try {
      const { content } = req.body;
      const result = await AdminService.updatePrivacyPolicy(content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCustomerAgreement(req, res) {
    try {
      const { content } = req.body;
      const result = await AdminService.updateCustomerAgreement(content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateHeader(req, res) {
    try {
      const { menu1, menu2, menu3, menu4, menu5, menu6 } = req.body;
      const result = await AdminService.updateHeader({
        menu1,
        menu2,
        menu3,
        menu4,
        menu5,
        menu6,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHeader(req, res) {
    try {
      const result = await AdminService.getHeader();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSEOData(req, res) {
    try {
      const result = await AdminService.getSEOData();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSEOData(req, res) {
    try {
      const { title, desc, alt_image, keywords, urllink, image_path } =
        req.body;
      const result = await AdminService.updateSEOData({
        title,
        desc,
        alt_image,
        keywords,
        urllink,
        image_path,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFooter(req, res) {
    try {
      const result = await AdminService.getFooter();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateFooter(req, res) {
    try {
      const {
        marketing_section_data,
        website_section_data,
        contact_us_section_data,
      } = req.body;
      const result = await AdminService.updateFooter({
        marketing_section_data,
        website_section_data,
        contact_us_section_data,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContactUs(req, res) {
    try {
      const result = await AdminService.getContactUs();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateContactUs(req, res) {
    try {
      const contactData = req.body;
      const result = await AdminService.updateContactUs(contactData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResourceData(req, res) {
    try {
      const result = await AdminService.getResourceData();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAboutUs(req, res) {
    try {
      const result = await AdminService.getAboutUs();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAboutUs(req, res) {
    try {
      const { heading_section, block1, block2 } = req.body;
      const result = await AdminService.updateAboutUs({
        heading_section,
        block1,
        block2,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPromotions(req, res) {
    try {
      const result = await AdminService.getPromotions();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addPromotion(req, res) {
    try {
      const { code, start_date, end_date, html_template } = req.body;
      const result = await AdminService.addPromotion({
        code,
        start_date,
        end_date,
        html_template,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePromotion(req, res) {
    try {
      const { record_id, code, start_date, end_date, html_template } = req.body;
      const result = await AdminService.updatePromotion(record_id, {
        code,
        start_date,
        end_date,
        html_template,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePromotion(req, res) {
    try {
      const { record_id } = req.body;
      const result = await AdminService.deletePromotion(record_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBannerData(req, res) {
    try {
      const result = await AdminService.getBannerData();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async addBannerData(req, res) {
    try {
      const result = await AdminService.addBannerData(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async editBannerData(req, res) {
    try {
      const result = await AdminService.editBannerData(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }


  async deleteBannerData(req, res) {
    try {
      const result = await AdminService.deleteBannerData(req.body.record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }


  async updateBannerStatus(req, res) {
    try {
      const result = await AdminService.updateBannerStatus(req.body.record_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}

module.exports = new AdminController();
