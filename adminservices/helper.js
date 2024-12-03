const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
var request = require('request');
const urlencode = require("urlencode");
const crypto = require("crypto");

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}
function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}
// Define allowed file types
const filetypes = /jpeg|jpg|png|gif/;
let storage = (uploadPath) => multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+path.extname(file.originalname))
    }
});
    
let file_upload = (uploadPath, fieldName) => multer({ 
    storage: storage(uploadPath),
    fileFilter: function (req, file, cb){
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("File upload only supports the "
                + "following filetypes - " + filetypes);
      }
}).single(fieldName);


const transporter = nodemailer.createTransport({
  host: process.env.SERVICE,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    }
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.MAILUSER,
        to:to.to,
        subject:to.subject,
        text:to.text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
   function getFirstLetters(str) {
    const firstLetters = str
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  
    return firstLetters;
  }

  function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return { salt, hash };
  }

  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
module.exports = {
  getOffset,
  emptyOrRows,
  file_upload,
  sendMail,
  getFirstLetters,
  hashPassword,
  generateOtp
}