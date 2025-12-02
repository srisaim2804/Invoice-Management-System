'use client'
import type { Products } from "@/types";
import { backendURL_Products } from "../../../config";
import { useEffect, useState } from "react";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchProducts = async () => {
    try {
      const server_response = await fetch(backendURL_Products);
      if (!server_response.ok) {
        const result = await server_response.json();
        throw new Error(result.message || 'Failed to fetch invoices');
      }
      const result = await server_response.json();

      if (result.data.length === 0) {
        setServerMessage(result.message || 'No invoices found');
      } else {
        setProducts(result.data);
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
    fetchProducts();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <div className="text-center mb-10">
        <p className="text-2xl font-bold">Products Records</p>
        {loading ? (
          <p className="text-blue-500">Loading...</p>
        ) : networkError ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className={error ? "text-red-500" : "text-black"}>{serverMessage}</p>
        )}
      </div>
      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Product Name</th>
                <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Quantity</th>
                <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Item Price</th>
                <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Tax</th>
                <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Price with Tax</th>
                <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Invoice Number</th>
                {/* <th className="border px-4 py-2 text-left whitespace-nowrap text-sm font-semibold text-gray-700">Discount</th> */}
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.product_name} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-gray-800">{product.product_name}</td>
                    <td className="border px-4 py-2 text-gray-800">{product.quantity}</td>
                    <td className="border px-4 py-2 text-gray-800">{product.unit_price}</td>
                    <td className="border px-6 py-3 text-center">
                      {product.tax ? product.tax : "No Tax"}
                    </td>
                    <td className="border px-4 py-2 text-gray-800">{product.price_with_tax ? product.price_with_tax: "No Price with Tax Found"}</td>
                    <td className="border px-4 py-2 text-gray-800">{product.invoice_number}</td>
                    {/* <td className="border px-4 py-2 text-gray-800">{product.discount? product.discount : "No Discount"}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">Empty Data from server</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Products;
