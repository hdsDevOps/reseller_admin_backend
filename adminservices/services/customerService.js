const { db } = require('../firebaseConfig');
const helper = require('../helper');

async function addCustomer(customerData) {
    try {
        const docRef = await db.collection('customers').add(customerData);
        return { status: 200, message: 'Customer added successfully', customerId: docRef.id };
    } catch (error) {
        return { status: 400, message: 'Error adding customer', error: error.message };
    }
}

async function getCustomer(customerId) {
    try {
        const doc = await db.collection('customers').doc(customerId).get();
        if (!doc.exists) {
            throw new Error('Customer not found');
        }
        return { status: 200, customer: doc.data() };
    } catch (error) {
        return { status: 400, message: 'Error getting customer', error: error.message };
    }
}

async function sendNotification(customerId, message) {
    try {
        const customerDoc = await db.collection('customers').doc(customerId).get();
        if (!customerDoc.exists) {
            throw new Error('Customer not found');
        }
        const customerEmail = customerDoc.data().email;
        await helper.sendMail(customerEmail, 'Notification', message);
        return { status: 200, message: 'Notification sent successfully' };
    } catch (error) {
        return { status: 400, message: 'Error sending notification', error: error.message };
    }
}

async function editCustomer(customerId, updateData) {
    try {
        await db.collection('customers').doc(customerId).update(updateData);
        return { status: 200, message: 'Customer updated successfully' };
    } catch (error) {
        return { status: 400, message: 'Error updating customer', error: error.message };
    }
}

async function deleteCustomer(customerId) {
    try {
        await db.collection('customers').doc(customerId).delete();
        return { status: 200, message: 'Customer deleted successfully' };
    } catch (error) {
        return { status: 400, message: 'Error deleting customer', error: error.message };
    }
}

async function cancelSubscription(customerId) {
    try {
        await db.collection('customers').doc(customerId).update({
            subscriptionStatus: 'cancelled'
        });
        return { status: 200, message: 'Subscription cancelled successfully' };
    } catch (error) {
        return { status: 400, message: 'Error cancelling subscription', error: error.message };
    }
}

async function suspendAccount(customerId) {
    try {
        await db.collection('customers').doc(customerId).update({
            accountStatus: 'suspended'
        });
        return { status: 200, message: 'Account suspended successfully' };
    } catch (error) {
        return { status: 400, message: 'Error suspending account', error: error.message };
    }
}

async function transferAccount(customerId, newOwnerId) {
    try {
        // Implement the logic for transferring an account
        // This might involve updating ownership information and other relevant data
        return { status: 200, message: 'Account transferred successfully' };
    } catch (error) {
        return { status: 400, message: 'Error transferring account', error: error.message };
    }
}


async function getAllCustomers(page, limit) {
    try {
        const customersRef = db.collection('customers');
        const snapshot = await customersRef.get();
        const totalCount = snapshot.size;

        const startAt = (page - 1) * limit;
        const customersQuery = customersRef.orderBy('name').offset(startAt).limit(limit);
        const customersSnapshot = await customersQuery.get();

        const customers = [];
        customersSnapshot.forEach(doc => {
            customers.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return {
            status: 200,
            customers: customers,
            totalCount: totalCount,
            page: page,
            limit: limit
        };
    } catch (error) {
        return { status: 400, message: 'Error retrieving customers', error: error.message };
    }
}

module.exports = {
    addCustomer,
    getCustomer,
    sendNotification,
    editCustomer,
    deleteCustomer,
    cancelSubscription,
    suspendAccount,
    transferAccount,
    getAllCustomers  
};