// adminRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/admin_controller');
const multer = require('multer');
const path = require('path');
/**
 * @swagger
 * /admin/api/v1/login:
 *   post:
 *     summary: Login to admin portal
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", adminController.login);

/**
 * @swagger
 * /admin/api/v1/otpverify:
 *   post:
 *     summary: Verify OTP for login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.post("/otpverify", adminController.verifyOtp);

/**
 * @swagger
 * /admin/api/v1/resendotp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Error resending OTP
 */
router.post("/resendotp", adminController.resendOtp);

/**
 * @swagger
 * /admin/api/v1/logout:
 *   get:
 *     summary: Logout user/admin from portal
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.get("/logout", authMiddleware, adminController.logout);

/**
 * @swagger
 * /admin/api/v1/addfaq:
 *   post:
 *     summary: Add new FAQ
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               ans:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ added successfully
 *       400:
 *         description: Error adding FAQ
 */
router.post("/addfaq", authMiddleware, adminController.addFaq);

/**
 * @swagger
 * /admin/api/v1/faqlist:
 *   get:
 *     summary: Get FAQ list
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: FAQ list retrieved successfully
 *       400:
 *         description: Error retrieving FAQ list
 */
router.get("/faqlist", authMiddleware, adminController.getFaqList);

/**
 * @swagger
 * /admin/api/v1/editfaq:
 *   post:
 *     summary: Edit FAQ details
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *               question:
 *                 type: string
 *               ans:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Error updating FAQ
 */
router.post("/editfaq", authMiddleware, adminController.editFaq);

/**
 * @swagger
 * /admin/api/v1/deletefaq:
 *   post:
 *     summary: Delete FAQ record
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *       400:
 *         description: Error deleting FAQ
 */
router.post("/deletefaq", authMiddleware, adminController.deleteFaq);

/**
 * @swagger
 * /admin/api/v1/emailloglist:
 *   get:
 *     summary: Get email log list
 *     tags: [Email Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email log list retrieved successfully
 *       400:
 *         description: Error retrieving email log list
 */
router.get("/emailloglist", authMiddleware, adminController.getEmailLogList);

/**
 * @swagger
 * /admin/api/v1/emaillogdetails:
 *   post:
 *     summary: Get email log details
 *     tags: [Email Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email log details retrieved successfully
 *       400:
 *         description: Error retrieving email log details
 */
router.post(
  "/emaillogdetails",
  authMiddleware,
  adminController.getEmailLogDetails
);

/**
 * @swagger
 * /admin/api/v1/updateterms:
 *   post:
 *     summary: Update terms & conditions
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Terms & conditions updated successfully
 */
router.post(
  "/updateterms",
  authMiddleware,
  adminController.updateTermsConditions
);

/**
 * @swagger
 * /admin/api/v1/updatepolicy:
 *   post:
 *     summary: Update privacy policy
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Privacy policy updated successfully
 */
router.post(
  "/updatepolicy",
  authMiddleware,
  adminController.updatePrivacyPolicy
);

/**
 * @swagger
 * /admin/api/v1/updateagreement:
 *   post:
 *     summary: Update customer agreement
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer agreement updated successfully
 */
router.post(
  "/updateagreement",
  authMiddleware,
  adminController.updateCustomerAgreement
);

/**
 * @swagger
 * /admin/api/v1/cmsupdateheader:
 *   post:
 *     summary: Update CMS Header Section
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menu1:
 *                 type: string
 *               menu2:
 *                 type: string
 *               menu3:
 *                 type: string
 *               menu4:
 *                 type: string
 *               menu5:
 *                 type: string
 *               menu6:
 *                 type: string
 */
router.post("/cmsupdateheader", authMiddleware, adminController.updateHeader);

/**
 * @swagger
 * /admin/api/v1/cmsgetheader:
 *   get:
 *     summary: Get CMS Header Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 */
router.get("/cmsgetheader", authMiddleware, adminController.getHeader);

/**
 * @swagger
 * /admin/api/v1/cmsgetseodata:
 *   get:
 *     summary: Get CMS SEO Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 */
router.get("/cmsgetseodata", authMiddleware, adminController.getSEOData);

/**
 * @swagger
 * /admin/api/v1/cmsupdateseodata:
 *   post:
 *     summary: Update CMS SEO Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               desc:
 *                 type: string
 *               alt_image:
 *                 type: string
 *               keywords:
 *                 type: string
 *               urllink:
 *                 type: string
 *               image_path:
 *                 type: string
 */
router.post("/cmsupdateseodata", authMiddleware, adminController.updateSEOData);

/**
 * @swagger
 * /admin/api/v1/cmsgetfooter:
 *   get:
 *     summary: Get CMS Footer Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 */
router.get("/cmsgetfooter", authMiddleware, adminController.getFooter);

/**
 * @swagger
 * /admin/api/v1/cmsupdatefooterdata:
 *   post:
 *     summary: Update CMS Footer Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marketing_section_data:
 *                 type: array
 *               website_section_data:
 *                 type: array
 *               contact_us_section_data:
 *                 type: array
 */
router.post(
  "/cmsupdatefooterdata",
  authMiddleware,
  adminController.updateFooter
);

/**
 * @swagger
 * /admin/api/v1/cmsgetcontactus:
 *   get:
 *     summary: Get CMS Contact Us Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 */
router.get("/cmsgetcontactus", authMiddleware, adminController.getContactUs);

/**
 * @swagger
 * /admin/api/v1/cmsupdatecontactus:
 *   post:
 *     summary: Update CMS Contact Us Section
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               content_description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact us section updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/cmsupdatecontactus",
  authMiddleware,
  adminController.updateContactUs
);

/**
 * @swagger
 * /admin/api/v1/cmsgetresourcedata:
 *   get:
 *     summary: Get CMS Resource section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resource data retrieved successfully
 */
router.get(
  "/cmsgetresourcedata",
  authMiddleware,
  adminController.getResourceData
);

/**
 * @swagger
 * /admin/api/v1/cmsgetaboutus:
 *   get:
 *     summary: Get CMS About us section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: About us data retrieved successfully
 */
router.get("/cmsgetaboutus", authMiddleware, adminController.getAboutUs);

/**
 * @swagger
 * /admin/api/v1/cmsupdateaboutus:
 *   post:
 *     summary: Update CMS About us Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heading_section:
 *                 type: array
 *               block1:
 *                 type: array
 *               block2:
 *                 type: array
 *     responses:
 *       200:
 *         description: About us data updated successfully
 */
router.post("/cmsupdateaboutus", authMiddleware, adminController.updateAboutUs);

/**
 * @swagger
 * /admin/api/v1/cmsgetpromotiondata:
 *   get:
 *     summary: Get CMS promotions section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Promotions data retrieved successfully
 */
router.get(
  "/cmsgetpromotiondata",
  authMiddleware,
  adminController.getPromotions
);

/**
 * @swagger
 * /admin/api/v1/cmsaddpromotion:
 *   post:
 *     summary: Add new CMS promotion Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               html_template:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion added successfully
 */
router.post("/cmsaddpromotion", authMiddleware, adminController.addPromotion);

/**
 * @swagger
 * /admin/api/v1/cmsupdatepromotion:
 *   post:
 *     summary: Update CMS promotion Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *               code:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               html_template:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 */
router.post(
  "/cmsupdatepromotion",
  authMiddleware,
  adminController.updatePromotion
);

/**
 * @swagger
 * /admin/api/v1/cmsdeletepromotion:
 *   post:
 *     summary: Delete CMS promotion Section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 */
router.post(
  "/cmsdeletepromotion",
  authMiddleware,
  adminController.deletePromotion
);



/**
 * @swagger
 * /admin/api/v1/cmsgetbannerdata:
 *   get:
 *     summary: Get CMS banner section data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Banner data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   video_url:
 *                     type: string
 *                   button_title:
 *                     type: string
 *                   button_url:
 *                     type: string
 *                   background_image:
 *                     type: string
 *                   show_video_status:
 *                     type: boolean
 *                   show_promotion_status:
 *                     type: boolean
 *                   currency_details:
 *                     type: object
 */
router.get("/cmsgetbannerdata", authMiddleware, adminController.getBannerData);

/**
 * @swagger
 * /admin/api/v1/cmsaddbannerdata:
 *   post:
 *     summary: Add new banner data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               button_title:
 *                 type: string
 *               button_url:
 *                 type: string
 *               background_image:
 *                 type: string
 *               show_video_status:
 *                 type: boolean
 *               show_promotion_status:
 *                 type: boolean
 *               currency_details:
 *                 type: object
 *     responses:
 *       200:
 *         description: Banner added successfully
 */
router.post("/cmsaddbannerdata", authMiddleware, adminController.addBannerData);

/**
 * @swagger
 * /admin/api/v1/cmseditbannerdata:
 *   post:
 *     summary: Edit existing banner data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               button_title:
 *                 type: string
 *               button_url:
 *                 type: string
 *               background_image:
 *                 type: string
 *               show_video_status:
 *                 type: boolean
 *               show_promotion_status:
 *                 type: boolean
 *               currency_details:
 *                 type: object
 *     responses:
 *       200:
 *         description: Banner updated successfully
 */
router.post("/cmseditbannerdata", authMiddleware, adminController.editBannerData);

/**
 * @swagger
 * /admin/api/v1/cmsdeletebannerdata:
 *   post:
 *     summary: Delete banner data
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 */
router.post("/cmsdeletebannerdata", authMiddleware, adminController.deleteBannerData);

/**
 * @swagger
 * /admin/api/v1/cmsupdatestatusbannerdata:
 *   post:
 *     summary: Update banner status
 *     tags: [CMS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner status updated successfully
 */
router.post("/cmsupdatestatusbannerdata", authMiddleware, adminController.updateBannerStatus);


// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpeg', '.jpg'];

    if (!allowedExtensions.includes(fileExtension)) {
      return cb(
        new Error(`File upload only supports the following file types: ${allowedExtensions.join(', ')}`)
      );
    }
    cb(null, true);
  },
});

// Error-handling middleware for Multer
const uploadImageMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof Error) {
      // If Multer or fileFilter throws an error, send a JSON response
      return res.status(400).send({status: "error",message:err.message});
    }
    next();
  });
};



router.post("/uploadimage", authMiddleware,uploadImageMiddleware, adminController.uploadimage);


router.post(
  "/cmsupdateresourcedata",
  authMiddleware,
  adminController.updateresourcedata
);

 module.exports = router;
