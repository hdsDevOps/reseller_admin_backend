const { admin, db } = require("../firebaseConfig");
const { sendMail } = require("../helper");
const { generateToken } = require("../utils/jwt");
const CryptoJS = require("crypto-js");

class AdminService {
  async login({ email, password }) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);

      const otp = this.generateOtp();
      
      await this.storeOtp(userRecord.uid, otp);
      await this.sendLoginOtp(email, otp);

      return {
        status: 200,
        message: "OTP sent successfully",
        userId: userRecord.uid,
      };
    } catch (error) {
      throw new Error("Login failed.Please check: " + error.message);
    }
  }

  async verifyOtp({ admin_id, otp }) {    
    try {
      const result = await this.validateOtp(admin_id, otp);
      if (result.valid) {
        let id = admin_id;
        const token = generateToken({ id });
        
        return {
          status: 200,
          token,
          message: "Login successful",
        };
      }
      throw new Error("Invalid OTP");
    } catch (error) {
      throw new Error("OTP verification failed: " + error.message);
    }
  }

  async resendOtp({ admin_id }) {
    try {
      const userRecord = await this.getUserById(admin_id);
      const otp = this.generateOtp();
      await this.storeOtp(admin_id, otp);
      await this.sendLoginOtp(userRecord.email, otp);

      return {
        status: 200,
        message: "OTP resent successfully",
      };
    } catch (error) {
      throw new Error("Failed to resend OTP: " + error.message);
    }
  }

  async logout(userId) {
    try {
      // Revoke all refresh tokens for user
      await admin.auth().revokeRefreshTokens(userId);
      return { status: 200, message: "Logged out successfully" };
    } catch (error) {
      throw new Error("Error during logout");
    }
  }

  // FAQ Methods
  async addFaq({ question, answer, order }) {
    try {
      const faqRef = await db.collection("faqs").add({
        question,
        answer,
        order,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        status: 200,
        message: "FAQ added successfully",
        faqId: faqRef.id,
      };
    } catch (error) {
      throw new Error("Failed to add FAQ: " + error.message);
    }
  }

  async getFaqList() {
    try {
      const snapshot = await db
        .collection("faqs")
        .orderBy("order", "asc")
        .get();

      const faqs = [];
      snapshot.forEach((doc) => {
        faqs.push({
          record_id: doc.id,
          ...doc.data(),
        });
      });

      return {
        status: 200,
        data: faqs,
      };
    } catch (error) {
      throw new Error("Error retrieving FAQ list");
    }
  }

  async editFaq({record_id, question, answer, order}) {
    try {
      await db.collection("faqs").doc(record_id).update({
        question,
        answer,
        order,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        status: 200,
        message: "FAQ updated successfully",
      };
    } catch (error) {
      throw new Error("Error updating FAQ "+error);
    }
  }

  async deleteFaq(record_id) {
    try {
      //await db.collection("faqs").doc(record_id).delete();

      return {
        status: 200,
        message: "FAQ deleted successfully",
      };
    } catch (error) {
      throw new Error("Error deleting FAQ");
    }
  }

  async getEmailLogList() {
    try {
      const snapshot = await db
        .collection("email_logs")
        .orderBy("timestamp", "desc")
        .get();

      const logs = [];
      snapshot.forEach((doc) => {
        logs.push({
          record_id: doc.id,
          ...doc.data(),
        });
      });

      return {
        status: 200,
        data: logs,
      };
    } catch (error) {
      throw new Error("Error retrieving email logs");
    }
  }

  async getEmailLogDetails(record_id) {
    try {
      const doc = await db.collection("email_logs").doc(record_id).get();

      if (!doc.exists) {
        throw new Error("Email log not found");
      }

      return {
        status: 200,
        data: {
          record_id: doc.id,
          ...doc.data(),
        },
      };
    } catch (error) {
      throw new Error("Error retrieving email log details "+error);
    }
  }

  async updateTermsConditions(content) {
    try {
      const docRef = db.collection("cms").doc("terms_conditions");
      await docRef.set({
        content,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {
        success: true,
        message: "Terms and conditions updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update terms and conditions");
    }
  }

  async updatePrivacyPolicy(content) {
    try {
      const docRef = db.collection("cms").doc("privacy_policy");
      await docRef.set({
        content,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "Privacy policy updated successfully" };
    } catch (error) {
      throw new Error("Failed to update privacy policy");
    }
  }

  async updateCustomerAgreement(content) {
    try {
      const docRef = db.collection("cms").doc("customer_agreement");
      await docRef.set({
        content,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {
        success: true,
        message: "Customer agreement updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update customer agreement");
    }
  }

  async updateHeader(headerData) {
    try {
      const docRef = db.collection("cms").doc("header");
      await docRef.set({
        menu1: headerData.menu1,
        menu2: headerData.menu2,
        menu3: headerData.menu3,
        menu4: headerData.menu4,
        menu5: headerData.menu5,
        menu6: headerData.menu6,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "Header updated successfully" };
    } catch (error) {
      throw new Error("Failed to update header");
    }
  }

  async getHeader() {
    try {
      const doc = await db.collection("cms").doc("header").get();
      if (!doc.exists) {
        throw new Error("Header data not found");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch header data");
    }
  }

  async getSEOData() {
    try {
      const doc = await db.collection("cms").doc("seo").get();
      if (!doc.exists) {
        throw new Error("SEO data not found");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch SEO data "+error);
    }
  }

  async updateSEOData(seoData) {
    try {
      const docRef = db.collection("cms").doc("seo");
      await docRef.set({
        title: seoData.title,
        desc: seoData.desc,
        alt_image: seoData.alt_image,
        keywords: seoData.keywords,
        urllink: seoData.urllink,
        image_path: seoData.image_path,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "SEO data updated successfully" };
    } catch (error) {
      throw new Error("Failed to update SEO data");
    }
  }

  async getFooter() {
    try {
      const doc = await db.collection("cms").doc("footer").get();
      if (!doc.exists) {
        throw new Error("Footer data not found");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch footer data");
    }
  }

  async updateFooter(footerData) {
    try {
      const docRef = db.collection("cms").doc("footer");
      await docRef.set({
        marketing_section_data: footerData.marketing_section_data,
        website_section_data: footerData.website_section_data,
        contact_us_section_data: footerData.contact_us_section_data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "Footer data updated successfully" };
    } catch (error) {
      throw new Error("Failed to update footer data");
    }
  }

  async getContactUs() {
    try {
      const doc = await db.collection("cms").doc("contact_us").get();
      if (!doc.exists) {
        throw new Error("Contact us data not found");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch contact us data");
    }
  }

  async updateContactUs(contactData) {
    try {
      const docRef = db.collection("cms").doc("contact_us");
      await docRef.set({
        ...contactData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {
        success: true,
        message: "Contact us section updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update contact us section");
    }
  }

  async getResourceData() {
    try {
      const doc = await db.collection("cms").doc("resources").get();
      if (!doc.exists) {
        throw new Error("Resource data not found");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch resource data");
    }
  }

  async getAboutUs() {
    try {
      const doc = await db.collection("cms").doc("about_us").get();
      if (!doc.exists) {
        throw new Error("About us data not found");
      }
      return doc.data();
    } catch (error) {
      throw new Error("Failed to fetch about us data");
    }
  }

  async updateAboutUs(aboutData) {
    try {
      const docRef = db.collection("cms").doc("about_us");
      await docRef.set({
        ...aboutData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "About us data updated successfully" };
    } catch (error) {
      throw new Error("Failed to update about us data");
    }
  }

  async getPromotions() {
    try {
      const snapshot = await db.collection("promotions").get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error("Failed to fetch promotions");
    }
  }

  async addPromotion(promotionData) {
    try {
      const docRef = await db.collection("promotions").add({
        ...promotionData,
        createdAt: new Date(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {
        success: true,
        message: "Promotion added successfully",
        id: docRef.id,
      };
    } catch (error) {
      throw new Error("Failed to add promotion");
    }
  }

  async updatePromotion(recordId, promotionData) {
    try {
      const docRef = db.collection("promotions").doc(recordId);
      await docRef.update({
        ...promotionData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "Promotion updated successfully" };
    } catch (error) {
      throw new Error("Failed to update promotion");
    }
  }

  async deletePromotion(recordId) {
    try {
      await db.collection("promotions").doc(recordId).delete();
      return { success: true, message: "Promotion deleted successfully" };
    } catch (error) {
      throw new Error("Failed to delete promotion");
    }
  }

  async getBannerData() {
    try {
      const bannerRef = db.collection("banners");
      const snapshot = await bannerRef.get();
      const banners = [];

      snapshot.forEach((doc) => {
        banners.push({ id: doc.id, ...doc.data() });
      });

      return {
        status: "success",
        data: banners,
      };
    } catch (error) {
      throw new Error("Failed to fetch banner data: " + error.message);
    }
  }

  async addBannerData(bannerData) {
    try {
      const bannerRef = db.collection("banners");
      const newBanner = {
        ...bannerData,
        created_at: new Date(),
        active: true,
      };

      const docRef = await bannerRef.add(newBanner);

      return {
        status: "success",
        message: "Banner added successfully",
        data: { id: docRef.id, ...newBanner },
      };
    } catch (error) {
      throw new Error("Failed to add banner: " + error.message);
    }
  }

  async editBannerData(bannerData) {
    try {
      const { record_id, ...updateData } = bannerData;
      const bannerRef = db.collection("banners").doc(record_id);

      const banner = await bannerRef.get();
      if (!banner.exists) {
        throw new Error("Banner not found");
      }

      await bannerRef.update({
        ...updateData,
        updated_at: new Date(),
      });

      return {
        status: "success",
        message: "Banner updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update banner: " + error.message);
    }
  }

  async deleteBannerData(record_id) {
    try {
      const bannerRef = db.collection("banners").doc(record_id);

      const banner = await bannerRef.get();
      if (!banner.exists) {
        throw new Error("Banner not found");
      }

      await bannerRef.delete();

      return {
        status: "success",
        message: "Banner deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete banner: " + error.message);
    }
  }

  async updateBannerStatus(record_id) {
    try {
      const bannerRef = db.collection("banners").doc(record_id);

      const banner = await bannerRef.get();
      if (!banner.exists) {
        throw new Error("Banner not found");
      }

      const currentStatus = banner.data().active;
      await bannerRef.update({
        active: !currentStatus,
        updated_at: new Date(),
      });

      return {
        status: "success",
        message: "Banner status updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update banner status: " + error.message);
    }
  }

  // Helper methods
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async storeOtp(userId, otp) {
    try{
    const encryptedOtp = CryptoJS.AES.encrypt(
      otp.toString(),
      process.env.CRYPTOTOKEN
    ).toString();
console.log(otp.toString());
    await db
      .collection("users")
      .doc(userId)
      .update({
        otp: encryptedOtp,
        otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
      })
      .then((result)=>{
          console.log(result)
      })
    }
    catch(error)
    {
      throw new Error("Failed to update banner status: " + error.message);
    }
  }

  async sendLoginOtp(email, otp) {
    await sendMail({
      to: email,
      subject: "Login OTP",
      text: `Your login OTP is: ${otp}`,
    });
  }

  async validateOtp(userId, otp) {
    try {
      // Fetch the user data (specifically the OTP and expiry) from the database
      const userDoc = await db.collection("users").doc(userId).get();
      
      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const { otp: encryptedOtp, otpExpiry } = userDoc.data();

      // Decrypt the stored OTP
      const bytes = CryptoJS.AES.decrypt(encryptedOtp, process.env.CRYPTOTOKEN);
      const decryptedOtp = bytes.toString(CryptoJS.enc.Utf8);

      // Check if the OTP matches
      if (decryptedOtp !== otp.toString()) {
        return { valid: false, message: "Invalid OTP" };
      }

      // Check if the OTP has expired
      const currentTime = Date.now();
      if (currentTime > otpExpiry) {
        return { valid: false, message: "OTP has expired" };
      }

      // If both the OTP matches and hasn't expired
      return { valid: true, message: "OTP is valid" };
    } catch (error) {
      throw new Error("Failed to validate OTP: " + error.message);
    }
  }

  async getUserById(userId) {
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      return {
        status: 200,
        data: {
          id: userDoc.id,
          ...userDoc.data(),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch user: " + error.message);
    }
  }
}

module.exports = new AdminService();
