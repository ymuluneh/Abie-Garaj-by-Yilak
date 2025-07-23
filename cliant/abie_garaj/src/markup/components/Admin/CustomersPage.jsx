import React, { useState, useEffect } from "react";
import { getCustomers } from "../../../services/api";
import { Link } from "react-router-dom";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await getCustomers(currentPage, limit, searchTerm);
        setCustomers(response.data.customers);
        setTotalPages(Math.ceil(response.data.total / limit));
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a customer..."
          className="w-full p-3 border rounded-md"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">First Name</th>
                  <th className="py-3 px-4 text-left">Last Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Added Date</th>
                  <th className="py-3 px-4 text-left">Active</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{customer.customer_id}</td>
                    <td className="py-3 px-4">
                      {customer.customer_first_name}
                    </td>
                    <td className="py-3 px-4">{customer.customer_last_name}</td>
                    <td className="py-3 px-4">{customer.customer_email}</td>
                    <td className="py-3 px-4">
                      {customer.customer_phone_number}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(
                        customer.customer_added_date
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {customer.customer_active_status ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/customer/${customer.customer_id}`}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/customer/edit/${customer.customer_id}`}
                        className="text-green-500 hover:text-green-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomersPage;
