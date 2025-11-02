const { invoicesCollection } = require('../config/mongodb');

const insertOrUpdateInvoice = async (fileData) => {
    try {
        if (!fileData.invoice_number) {
            return 'Sorry, invoice number is not present. Please check the file and try again.';
        }
        
        const existingInvoice = await invoicesCollection.findOne({ invoice_number: fileData.invoice_number });
        if (existingInvoice) {
            await invoicesCollection.updateOne(
                { invoice_number: fileData.invoice_number },
                { $set: fileData }
            );
            return 'Invoice already exists. Updated record with current details.';
        } else {
            await invoicesCollection.insertOne(fileData);
            return 'Successfully added a new invoice record.';
        }
    } catch (error) {
        console.error('Error processing invoice:', error.message);
        throw new Error('Failed to process invoice');
    }
};


module.exports = {
    insertOrUpdateInvoice
};
