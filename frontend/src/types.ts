export interface Invoice {
    invoice_number: number,
    invoice_date: string,
    invoice_tax: string,
    total_amount: number,
    updateStatus: string,
}

export interface Customers {
    customer_name: string,
    phone_number: number,
    customer_phone: string,
    total_amount: string,
    invoice_number: string,
    invoice_date: string,
    updateStatus: string,
}

export interface Products {
    product_name: string,
    quantity: number,
    unit_price: number,
    tax: string,
    price_with_tax: string,
    discount: number,
    updateStatus: string,
    invoice_number: string,
}
export interface FileData {
  fileName: string;
  fileType: string;
  fileSize: number;
  [key: string]: string | number;
}
export interface IMenuItem {
    text: string;
    url: string;
}