'use client'
import type { Customers } from "@/types";
import { backendURL_Customers } from "../../../config";
import { useEffect, useState } from "react";
import Link from "next/link";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchCustomers = async () => {
    try {
      const server_response = await fetch(backendURL_Customers);
      if (!server_response.ok) {
        const result = await server_response.json();
        throw new Error(result.message || 'Failed to fetch invoices');
      }
      const result = await server_response.json();

      if (result.data.length === 0) {
        setServerMessage(result.message || 'No invoices found');
      } else {
        setCustomers(result.data);
      }
    } catch (error) {
      console.log(error);
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
    fetchCustomers();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <div className="grid grid-cols-2 gap-4 items-center mb-10 text-center">
        <p className="text-2xl font-bold">Customers Records</p>
        <div className="flex flex-col items-center">
          <p className=" text-black mb-2 ">Missing phone numbers? No worries — update here!</p>
          <Link href="/customer-update" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-lg">Update Customer</Link>
        </div>
      </div>

      {loading ? (
        <p className="text-blue-500">Loading...</p>
      ) : networkError ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className={error ? "text-red-500" : "text-black"}>{serverMessage}</p>
      )}

      {!loading && customers.length > 0 && (
        <div className="w-full max-w-4xl">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Invoice Number</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customer_phone} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-800">{customer.customer_name}</td>
                  <td className="border px-6 py-3 text-center">
                    {customer.customer_phone ? customer.customer_phone : "No phone number found"}
                  </td>
                  <td className="border px-4 py-2 text-gray-800">{customer.total_amount}</td>
                  <td className="border px-4 py-2 text-gray-800">{customer.invoice_number ? customer.invoice_number : "No Invoice for this customer."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Customers;
