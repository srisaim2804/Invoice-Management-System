const { productsCollection } = require('../config/mongodb');

const updateProduct = async (product) => {
    try {
        if (!product.product_name) {
            return 'Product name is missing. Skipping database update.';
        }

        const existingProduct = await productsCollection.findOne({
            product_name: product.product_name,
            invoice_number: product.invoice_number
        });

        if (existingProduct) {
            await productsCollection.updateOne(
                { product_name: product.product_name, invoice_number: product.invoice_number },
                { $set: product }
            );
            return 'A product with the same invoice number already exists. Updating the existing record with new values.';
        } else {
            await productsCollection.insertOne(product);
            return 'Successfully added a new product record.';
        }
    } catch (error) {
        console.error('Error processing product:', error.message);
        throw new Error('Failed to process product');
    }
};

module.exports = {
    updateProduct
};