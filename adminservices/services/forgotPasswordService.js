const {admin, db} = require('../firebaseConfig');
const CryptoJS = require("crypto-js");
const helper = require('../helper');

// Generate OTP for forget password
async function generateOTP(data) {
    let response_result = "";
    try {
        const { email } = data;
        const user = await admin.auth().getUserByEmail(email);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const encrypted_otp = CryptoJS.AES.encrypt(""+otp+"", process.env.CRYPTOTOKEN).toString();
        
        // Store OTP in Firestore
        await db.collection('otps').doc(email).set({
            otp: encrypted_otp,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send OTP via email
        helper.sendMail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);

        response_result = {status: 200, message: 'OTP sent to user email address.'};
    } catch (error) {
        response_result = {status: 400, message: 'Error generating OTP', error: error.message};
    }
    return response_result;
}

// Verify OTP
async function verifyOTP(data) {
    let response_result = "";
    try {
        const { email, otp } = data;
        const otpDoc = await db.collection('otps').doc(email).get();
        
        if (!otpDoc.exists) {
            throw new Error('No OTP found for this email');
        }

        const storedOtp = otpDoc.data().otp;
        const decrypted_otp = CryptoJS.AES.decrypt(storedOtp, process.env.CRYPTOTOKEN).toString(CryptoJS.enc.Utf8);

        if (otp === decrypted_otp) {
            response_result = {status: 200, message: 'OTP verified successfully'};
        } else {
            response_result = {status: 400, message: 'Invalid OTP'};
        }
    } catch (error) {
        response_result = {status: 400, message: 'Error verifying OTP', error: error.message};
    }
    return response_result;
}

// Reset Password
async function resetPassword(data) {
    let response_result = "";
    try {
        const { email, newPassword, otp } = data;
        
        // Verify OTP again
        const otpVerification = await verifyOTP({ email, otp });
        if (otpVerification.status !== 200) {
            throw new Error('Invalid or expired OTP');
        }

        // Update password in Firebase Auth
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(user.uid, {
            password: newPassword
        });

        // Delete the used OTP
        await db.collection('otps').doc(email).delete();

        response_result = {status: 200, message: 'Password reset successfully'};
    } catch (error) {
        response_result = {status: 400, message: 'Error resetting password', error: error.message};
    }
    return response_result;
}

module.exports = {
    generateOTP,
    verifyOTP,
    resetPassword
}