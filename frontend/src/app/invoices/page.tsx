'use client'
import type { Invoice } from "@/types";
import { backendURL_Invoices } from "../../../config";
import { useEffect, useState } from "react";

const Invoice: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchInvoices = async () => {
    try {
      const server_response = await fetch(backendURL_Invoices);
      if (!server_response.ok) {
        const result = await server_response.json();
        throw new Error(result.message || 'Failed to fetch invoices');
      }
  
      const result = await server_response.json();
  
      if (result.data.length === 0) {
        setServerMessage(result.message || 'No invoices found');
      } else {
        setInvoices(result.data);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        if (error.message === 'Failed to fetch') {
          setError('Error in connecting with backend. Please try again later.');
          setServerMessage('Error in connecting with backend. Please try again later.');
          setNetworkError(true);
        } else {
          setError(`TypeError: ${error.message}`);
          setServerMessage(`TypeError: ${error.message}`);
          setNetworkError(true);
        }
      } else if (error instanceof Error) {
        setError(error.message);
        setServerMessage(error.message);
      } else {
        setError('Internal Server Error');
        setServerMessage('Internal Server Error');
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <div className="text-center mb-10">
        <p className="text-2xl font-bold">Invoice Records</p>
        {loading ? (
          <p className="text-blue-500">Loading...</p>
        ) : networkError ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className={error ? "text-red-500" : "text-black"}>{serverMessage}</p>
        )}
      </div>

      {!loading && !networkError && invoices.length > 0 && (
        <div className="w-full max-w-4xl">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Invoice Number</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Invoice Date</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Invoice Tax</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.invoice_number} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-800">{invoice.invoice_number}</td>
                  <td className="border px-4 py-2 text-gray-800">{invoice.invoice_date}</td>
                  <td className="border px-4 py-2 text-gray-800">{invoice.invoice_tax ? invoice.invoice_tax : "No Tax Found"}</td>
                  <td className="border px-4 py-2 text-gray-800">{invoice.total_amount? invoice.total_amount: "No Total Amount Found"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Invoice;