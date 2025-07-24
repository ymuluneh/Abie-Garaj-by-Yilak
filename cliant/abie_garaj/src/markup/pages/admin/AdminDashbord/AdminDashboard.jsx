// markup/pages/admin/AdminDashboard/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import ProtectedRoute from "../../../components/ProtectedRout/ProtectedRoute"; // Adjust path as necessary

const AdminDashboard = () => {
  return (
    // Wrap the entire component with ProtectedRoute
    <ProtectedRoute roles={[1]}>
      {" "}
      {/* Assuming '1' is the Admin role ID */}
      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center mb-5">
                <h2>Admin Dashboard</h2>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            {/* Employee Management Card */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Employee Management</h5>
                  <p className="card-text">
                    Manage employee accounts and roles.
                  </p>
                  <Link
                    to="/admin/employees"
                    className="btn btn-primary btn-block mb-2"
                  >
                    View All Employees
                  </Link>
                  <Link
                    to="/admin/add-employee"
                    className="btn btn-secondary btn-block"
                  >
                    Add New Employee
                  </Link>
                </div>
              </div>
            </div>

            {/* Customer Management Card */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Customer Management</h5>
                  <p className="card-text">
                    Oversee customer profiles and details.
                  </p>
                  <Link
                    to="/admin/customers"
                    className="btn btn-primary btn-block mb-2"
                  >
                    View All Customers
                  </Link>
                  <Link
                    to="/admin/add-customer"
                    className="btn btn-secondary btn-block"
                  >
                    Add New Customer
                  </Link>
                </div>
              </div>
            </div>

            {/* Service Management Card */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Service Management</h5>
                  <p className="card-text">
                    Configure and manage available services.
                  </p>
                  <Link
                    to="/admin/services"
                    className="btn btn-primary btn-block"
                  >
                    Manage Services
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Management Card */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Order Management</h5>
                  <p className="card-text">
                    Track and manage all customer orders.
                  </p>
                  <Link
                    to="/admin/orders"
                    className="btn btn-primary btn-block mb-2"
                  >
                    View All Orders
                  </Link>
                  <Link
                    to="/admin/order"
                    className="btn btn-secondary btn-block"
                  >
                    Create New Order
                  </Link>
                </div>
              </div>
            </div>

            {/* You can add more cards here for other admin functionalities */}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
