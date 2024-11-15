const { db } = require('../firebaseConfig');

class SubscriptionService {
  async getPaymentMethods() {
    try {
      const methodsRef = db.collection('payment_methods');
      const snapshot = await methodsRef.get();
      const methods = [];
      
      snapshot.forEach(doc => {
        methods.push({ id: doc.id, ...doc.data() });
      });

      return {
        status: 'success',
        data: methods
      };
    } catch (error) {
      throw new Error('Failed to fetch payment methods: ' + error.message);
    }
  }

  async updatePaymentMethodStatus(record_id, status) {
    try {
      const methodRef = db.collection('payment_methods').doc(record_id);
      
      const method = await methodRef.get();
      if (!method.exists) {
        throw new Error('Payment method not found');
      }

      await methodRef.update({
        status: status,
        updated_at: new Date()
      });

      return {
        status: 'success',
        message: 'Payment method status updated successfully'
      };
    } catch (error) {
      throw new Error('Failed to update payment method status: ' + error.message);
    }
  }

  async getPlansList() {
    try {
      const plansRef = db.collection('subscription_plans');
      const snapshot = await plansRef.get();
      const plans = [];
      
      snapshot.forEach(doc => {
        plans.push({ id: doc.id, ...doc.data() });
      });

      return {
        status: 'success',
        data: plans
      };
    } catch (error) {
      throw new Error('Failed to fetch plans: ' + error.message);
    }
  }

  async addNewPlan(planData) {
    try {
      const plansRef = db.collection('subscription_plans');
      const newPlan = {
        ...planData,
        created_at: new Date(),
        status: true
      };
      
      const docRef = await plansRef.add(newPlan);

      return {
        status: 'success',
        message: 'Plan added successfully',
        data: { id: docRef.id, ...newPlan }
      };
    } catch (error) {
      throw new Error('Failed to add plan: ' + error.message);
    }
  }

  async deletePlan(record_id) {
    try {
      const planRef = db.collection('subscription_plans').doc(record_id);
      
      const plan = await planRef.get();
      if (!plan.exists) {
        throw new Error('Plan not found');
      }

      await planRef.delete();

      return {
        status: 'success',
        message: 'Plan deleted successfully'
      };
    } catch (error) {
      throw new Error('Failed to delete plan: ' + error.message);
    }
  }

  async editPlan(planData) {
    try {
      const { record_id, ...updateData } = planData;
      const planRef = db.collection('subscription_plans').doc(record_id);
      
      const plan = await planRef.get();
      if (!plan.exists) {
        throw new Error('Plan not found');
      }

      await planRef.update({
        ...updateData,
        updated_at: new Date()
      });

      return {
        status: 'success',
        message: 'Plan updated successfully'
      };
    } catch (error) {
      throw new Error('Failed to update plan: ' + error.message);
    }
  }
}

module.exports = new SubscriptionService();