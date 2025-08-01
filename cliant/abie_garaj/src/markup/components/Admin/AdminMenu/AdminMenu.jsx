import React from 'react';
import { Link } from 'react-router-dom';

function AdminMenu(props) {
  return (
    <div>
      <div className="admin-menu">
        <h2>Admin Menu</h2>
      </div>
      <div className="list-group">
        <Link to="/admin" className="list-group-item">Dashboard</Link>
        <Link to="/admin/orders" className="list-group-item">Orders</Link>
        <Link to="/admin/order" className="list-group-item">New order</Link>
        <Link to="/admin/add-employee" className="list-group-item">Add employee</Link>
        <Link to="/admin/employees" className="list-group-item">Employees</Link>
        <Link to="/admin/add-customer" className="list-group-item">Add customer</Link>
        <Link to="/admin/customers" className="list-group-item">Customers</Link>
        <Link to="/admin/services" className="list-group-item">Services</Link>
        
        <Link to="/admin/inventory" className="list-group-item">Inventory</Link>
        <Link to="/admin/vehicles" className="list-group-item">Vehicles</Link>
        <Link to="/admin/add-vehicle" className="list-group-item">Add Vehicle</Link>
      </div>
    </div>
  );
}

export default AdminMenu;