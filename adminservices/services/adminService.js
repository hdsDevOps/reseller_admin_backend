// adminService.js
const { db } = require('../firebaseConfig');
const helper = require('../helper');
const jwt = require('jsonwebtoken');

async function login(email, password) {
    try {
        // Implement login logic here
        // This is a placeholder implementation
        const user = await db.collection('admins').where('email', '==', email).get();
        if (user.empty) {
            throw new Error('User not found');
        }
        // Check password (use proper hashing in production)
        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        await helper.sendMail(email, 'Login OTP', `Your OTP is: ${otp}`);
        return { status: 200, message: 'OTP sent to email', admin_id: user.docs[0].id };
    } catch (error) {
        return { status: 400, message: 'Login failed', error: error.message };
    }
}

async function verifyOtp(admin_id, otp) {
    try {
        // Implement OTP verification logic here
        // This is a placeholder implementation
        const admin = await db.collection('admins').doc(admin_id).get();
        if (!admin.exists) {
            throw new Error('Admin not found');
        }
        // Verify OTP (implement proper OTP verification in production)
        const token = jwt.sign({ id: admin_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { status: 200, message: 'Login successful', token };
    } catch (error) {
        return { status: 400, message: 'OTP verification failed', error: error.message };
    }
}

