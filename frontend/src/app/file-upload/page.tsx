'use client'
import { useState } from "react";
import { backendURL_FileUpload } from "../../../config";
import { FaFilePdf, FaFileImage, FaFileExcel, FaFile } from "react-icons/fa";
import type { Invoice } from "@/types";
import type { Customers } from "@/types";
import type { Products } from "@/types";

const FileUpload: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedInvoiceData, setUploadedInvoiceData] = useState<Invoice[]>([]);
  const [uploadedCustomerData, setUploadedCustomerData] = useState<Customers[]>([]);
  const [uploadedProductData, setUploadedProductData] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size.toString());

    try {
      const response = await fetch(backendURL_FileUpload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        throw new Error(errorResponse.message || 'Failed to upload file');
      }

      const result = await response.json();
      console.log('Success:', result);
      setMessage(result.message);
      setUploadedInvoiceData(result.invoiceData || []);
      setUploadedCustomerData(result.customerData || []);
      setUploadedProductData(result.productData || []);

    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error && error.message === 'Failed to fetch') {
        setErrorText('Unable to connect to the server. one possible reason is I used Vercels free plan and request time limit of 60 seconds. Please upload small file size.');
      } else {
        setErrorText("Internal Server Error in extracting data, please upload other file or try again.");
      }
    }
  };

  const fileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setErrorText('');
    setMessage('');
    setUploadedCustomerData([]);
    setUploadedInvoiceData([]);
    setUploadedProductData([]);
    event.preventDefault();
    if (selectedFiles.length > 0) {
      setIsLoading(true);
      await Promise.all(selectedFiles.map(file => handleFileUpload(file)));
      setIsLoading(false);
    } else {
      console.log('No file selected - please select a file');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };
  const getSimplifiedFileType = (fileType: string) => {
    if (fileType === "application/pdf") {
      return "PDF";
    }
    if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return "Excel (XLSX)";
    }
    return fileType.split("/")[1];
  };

  return (
    <section className="relative flex flex-col items-center justify-center pb-0 pt-20 md:pt-40">
      <form onSubmit={fileSubmit} className="w-full max-w-4xl">
        <p className="text-center mb-5 text-lg font-bold">Upload Documents</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {/* Left Grid - File upload options */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* First Row: PDF and Image side by side */}
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer justify-center">
              <FaFilePdf /> Upload PDF
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer justify-center">
              <FaFileImage /> Upload Image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {/* Second Row: Centered Excel button */}
            <div className="col-span-2 flex justify-center">
              <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer">
                <FaFileExcel /> Upload Excel
                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Right Grid - Content & Upload any file */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-center">Not sure the file extension? Don’t worry, upload here — we will take care of it.</p>
            <div className="flex justify-center items-center w-full">
              <label className="flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer w-3/5">
                <FaFile /> Upload any File type
                <input type="file" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-8 border rounded shadow-md w-full p-8">
            <h3 className="text-xl font-bold text-center mb-6">Selected Files</h3>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-6 py-3 text-left">File Name</th>
                  <th className="border px-6 py-3 text-left">File Type</th>
                  <th className="border px-6 py-3 text-left">File Size (bytes)</th>
                </tr>
              </thead>
              <tbody>
                {selectedFiles.map((file) => (
                  <tr key={file.name} className="hover:bg-gray-50">
                    <td className="border px-6 py-3 text-center">{file.name}</td>
                    <td className="border px-6 py-3 text-center">{getSimplifiedFileType(file.type)}</td>
                    <td className="border px-6 py-3 text-center">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedFiles.length === 0 && (
          <p className="text-center py-4">No file selected - please select a file</p>
        )}
        {errorText && (
          <p className="text-center text-red-600 mt-4 font-medium">
            {errorText}
          </p>
        )}
        <div className="flex justify-center items-center mt-8">
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded max-w-xs"
          >
            {isLoading ? 'Uploading, Please wait...' : 'Submit'}
          </button>
        </div>

      </form>
      <section className="relative flex flex-col items-center justify-center pb-0 pt-3 md:pt-5 px-8 md:px-16">
        <p className="text-center text-lg font-semibold text-green-600 mb-4">{message}</p>

        {uploadedInvoiceData.length > 0 && (
          <div className="mt-2 border rounded shadow-md w-full p-8">
            <h3 className="text-xl font-bold text-center mb-6">Uploaded Invoice Data</h3>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-6 py-3 text-left">Invoice ID</th>
                  <th className="border px-6 py-3 text-left">Invoice Tax</th>
                  <th className="border px-6 py-3 text-left">Invoice Date</th>
                  <th className="border px-6 py-3 text-left">Total Amount</th>
                  <th className="border px-6 py-3 text-left">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadedInvoiceData.map((invoice, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-6 py-3 text-center">{invoice.invoice_number}</td>
                    <td className="border px-6 py-3 text-center">{invoice.invoice_tax ? invoice.invoice_tax : "No tax"}</td>
                    <td className="border px-6 py-3 text-center">{invoice.invoice_date}</td>
                    <td className="border px-6 py-3 text-center">{invoice.total_amount}</td>
                    <td className="border px-6 py-3 text-center">{invoice.updateStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {uploadedCustomerData.length > 0 && (
          <div className="mt-2 border rounded shadow-md w-full p-8">
            <h3 className="text-xl font-bold text-center mb-6">Uploaded Customer Data</h3>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-6 py-3 text-left">Name</th>
                  <th className="border px-6 py-3 text-left">Phone Number</th>
                  <th className="border px-6 py-3 text-left">Total Amount Purchased</th>
                  <th className="border px-6 py-3 text-left">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadedCustomerData.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-6 py-3 text-center">
                      {customer.customer_name ? customer.customer_name : "No customer number for this amount"}
                    </td>
                    <td className="border px-6 py-3 text-center">
                      {customer.customer_phone ? customer.customer_phone : "No phone number found"}
                    </td>
                    <td className="border px-6 py-3 text-center">{customer.total_amount}</td>
                    <td className="border px-6 py-3 text-center">{customer.updateStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {message && uploadedProductData.length == 0 && (<p className="text-center py-4 font-bold">No products found in the file</p>)}
        {uploadedProductData.length > 0 && (
          <div className="mt-2 border rounded shadow-md w-full p-8">
            <h3 className="text-xl font-bold text-center mb-6">Uploaded Product Data</h3>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-6 py-3 text-left">Product Name</th>
                  <th className="border px-6 py-3 text-left">Quantity</th>
                  <th className="border px-6 py-3 text-left">Unit Price</th>
                  <th className="border px-6 py-3 text-left">Tax</th>
                  <th className="border px-6 py-3 text-left">Price with Tax</th>
                  <th className="border px-6 py-3 text-left">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadedProductData.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-6 py-3 text-center">{product.product_name}</td>
                    <td className="border px-6 py-3 text-center">{product.quantity}</td>
                    <td className="border px-6 py-3 text-center">{product.unit_price}</td>
                    <td className="border px-6 py-3 text-center">
                      {product.tax ? product.tax : "No Tax"}
                    </td>
                    <td className="border px-6 py-3 text-center">
                      {product.price_with_tax ? product.price_with_tax : "No price with tax found"}
                    </td>
                    <td className="border px-6 py-3 text-center">{product.updateStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {message && uploadedCustomerData.length == 0 && (<p className="text-center py-4 font-bold">No customers found in the file</p>)}
      </section>

    </section>
  );
};

export default FileUpload;