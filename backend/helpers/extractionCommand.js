const pdfExtractionCommand = 
`
  Extract the following fields from the invoice in a structured JSON format:
  - consignee_name: Name of the consignee (if available)
  - consignee_mobile_number: Mobile number of the consignee (if available)
  - consignee_address: Address of the consignee (if available)
  - customer_name: Name of the customer
  - customer_total_purchase_amount: Total purchase amount of the customer
  - invoice_number: Unique identifier for the invoice
  - invoice_date: Date of the invoice in DD-MM-YYYY format
  - total_amount: Total amount of the invoice (including taxes)
  
  - CGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.
  - SGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.
  - IGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.

  - items: Array of items with the following properties:
    - product_name: Name of the product
    - unit_price: Price of the item or rate/item or unit price
    - quantity: Quantity of the item purchased or qty
    - price_with_tax: Total Amount after applying tax
    - tax: GST or tax percentage applied to the item
  - Dont include Shipping Charges, debit card charges and Making charges in the items
  Ensure all fields are present, even if they have null or empty values. Use consignee details first, then fallback to customer details if missing.
  For CGST, SGST, and IGST:
  - Extract the total CGST, SGST, and IGST values from the invoice summary, grouped by GST percentage.
  - Create separate objects for CGST, SGST, and IGST, each containing tax percentages as keys and the corresponding tax amounts as values.
  - If IGST is not present in the invoice, return an empty object for IGST.
  - If CGST is not present in the invoice, return an empty object for CGST.
  - If SGST is not present in the invoice, return an empty object for SGST.
  - Ensure that each object reflects the correct tax amounts for each applicable percentage (e.g., "2.5%", "6%", etc.).
`;

const ImageExtractionCommand = 
`
  Extract the following fields from the invoice in a structured JSON format:
  - consignee_name: Name of the consignee (if available)
  - consignee_mobile_number: Mobile number of the consignee (if available)
  - consignee_address: Address of the consignee (if available)
  - customer_name: Name of the customer
  - customer_mobile_number: Mobile number of the customer
  - customer_total_purchase_amount: Total purchase amount of the customer
  - invoice_number: Unique identifier for the invoice
  - invoice_date: Date of the invoice in DD-MM-YYYY format
  - total_amount: Total amount of the invoice (including taxes)
  
  - CGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.
  - SGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.
  - IGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.

  - items: Array of items with the following properties:
    - product_name: Name of the product
    - unit_price: Price of the item or rate/item or unit price
    - quantity: Quantity of the item purchased or qty
    - discount: Discount applied to the item (if available). If no discount is present, return null or 0.
    - tax: GST or tax percentage applied only to the item.Do not consider tax of invoice. If no tax is present, set tax to null.
    - price_with_tax: If tax is null, then Quantity * (unit price / price of the item / rate/item).

  Ensure all fields are present, even if they have null or empty values. Use consignee details first, then fallback to customer details if missing.

  For CGST, SGST, and IGST:
  - Extract the total CGST, SGST, and IGST values from the invoice summary, grouped by GST percentage.
  - Create separate objects for CGST, SGST, and IGST, each containing tax percentages as keys and the corresponding tax amounts as values.
  - If IGST is not present in the invoice, return an empty object for IGST.
  - If CGST is not present in the invoice, return an empty object for CGST.
  - If SGST is not present in the invoice, return an empty object for SGST.
  - Ensure that each object reflects the correct tax amounts for each applicable percentage (e.g., "2.5%", "6%", etc.).
`;

const xlsxJsonExtractionCommand = `
  Extract and return only a structured JSON object with the following format without NOTE or any text:

  {
    "invoices": [
      {
        "invoice_number": null,
        "invoice_date": null,
        "customer_name": null,
        "invoice_tax": null,
        "customer_mobile_number": null,
        "CGST": null,
        "SGST": null,
        "IGST": null,
        "total_amount": null,
        "items": [
          {
            "product_name": null,
            "quantity": null,
            "unit_price": null,
            "tax": null,
            "price_with_tax: null,
            "discount": null
          }
        ]
      }
    ]
  }

  Steps for generating the JSON:
  1. Extract unique invoice details (based on invoice number).
  2. For each unique invoice, retrieve the corresponding invoice date from the first row.
  3. For each invoice, gather customer information: customer name from party name, and customer_mobile_number from phone_number. 
  4. Calculate total_amount by summing Price with Tax After Discount (if present) or Price with Tax for each product.
  5. For each invoice, calculate invoice tax.
  6. For each invoice, list all products with the following details:
    - product_name: Extracted from the Product Name column.
    - quantity: Extracted from the Qty column.
    - unit_price: If Unit Price Column available, Extract from the Unit Price Column. Else Extract from the Item Total Amount Column.
    - tax: Extracted from the Tax (%) column.
    - discount: Discount or any relevant discount value (if applicable, else set as 0).
    - price_with_tax: If Price with Tax Column available, Extracte from the Price with Tax column. Else, calculate using quantity * unit_price.
    If no product_name found for item, then don't add in the item list.
    - Dont include Shipping Charges, debit card charges and Making charges in the items
  Return the structured JSON with each invoice containing the necessary details, including customer and product information, total amount, invoice_tax.
  Return a valid structured data only.
`;


module.exports = { pdfExtractionCommand, xlsxJsonExtractionCommand, ImageExtractionCommand };