const { customersCollection } = require('../config/mongodb');

const insertOrUpdateCustomer = async (customer) => {
    try {
        if (!customer.customer_name) {
            return 'Customer name is missing. Skipping database update.';
        }
        const existingCustomer = await customersCollection.findOne({
            customer_name: customer.customer_name,
            invoice_number: customer.invoice_number
        });
        if (existingCustomer) {
            return 'Customer with same invoice already exists. Updating present details to existing record.';
        }
        await customersCollection.insertOne(customer);
        return 'Successfully added a new customer record.';
    } catch (error) {
        console.error('Error processing customer:', error.message);
        throw new Error('Failed to process customer');
    }
};

module.exports = {
    insertOrUpdateCustomer
};
