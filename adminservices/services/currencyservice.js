const { db } = require('../firebaseConfig');
const bcrypt = require('bcrypt');
const helper = require('../helper');

const CURRENCY_COLLECTION = 'currencies';

const getCurrencyDataService = async (customerId) => {
 
    const customerDoc = await db.collection(CURRENCY_COLLECTION).doc(customerId).get();
    if (!customerDoc.exists) {
        return null;
    }
    return customerDoc.data();
};

const updateDefaultCurrencyService = async (customerId, defaultCurrency) => {
    const customerRef = db.collection(CURRENCY_COLLECTION).doc(customerId);

    const customerDoc = await customerRef.get();
    if (!customerDoc.exists) {
      await customerRef.set({
        defaultCurrency,
        createdAt: new Date().toISOString(),
      })
    }

    await customerRef.update({ defaultCurrency });
};

module.exports = { getCurrencyDataService, updateDefaultCurrencyService };