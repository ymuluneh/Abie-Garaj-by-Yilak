import React from "react";
import "./App.css";

import { Route, Routes } from "react-router";

// Import the css files
import "./assets/template_assets/css/bootstrap.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/responsive.css";
import "./assets/template_assets/css/color.css";

// Import the custom css file
import "./assets/styles/custom.css";
import Header from "./markup/components/Header/Header";
import Footer from "./markup/components/Footer/Footer";
import Home from "./markup/pages/Home";
import Login from "./markup/components/LoginForm/LoginForm";
import AddEmployee from "./markup/pages/admin/AddEmployee";
import Unauthorized from "./markup/pages/Unauthorized";
import ProtectedRoute from "./markup/components/ProtectedRout/ProtectedRoute";
import Employees from "./markup/pages/admin/Employees";
import Service from "./markup/pages/Service";
import About from "./markup/pages/About";
import Contact from "./markup/pages/Contact";
import AddCustemer from "./markup/pages/admin/AddCustemer";
import CustomersPage from "./markup/pages/admin/CustomerList";
import CostomerProfil from "./markup/pages/admin/CostomerProfil";
import EditCustomer from "./markup/pages/admin/EditCustomer";
import Vehicle from "./markup/pages/admin/Vehicle";
import OrderList from "./markup/pages/admin/orders/OrderList";
import OrderDetail from "./markup/components/OrderList/OrderDetail";
import OrderEdit from "./markup/components/OrderList/OrderEdit";
import AdminDashboard from "./markup/pages/admin/AdminDashbord/AdminDashboard";
import CreatOrder from "./markup/pages/admin/orders/CreatOrder";
import EditEmployee from "./markup/pages/admin/EditEmployee";
import Services from "./markup/pages/admin/ServiceManagement/services";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/add-employee"
          element={
            <ProtectedRoute roles={[1]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-customer"
          element={
            <ProtectedRoute roles={[1]}>
              <AddCustemer />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/employees/edit/:id" element={<EditEmployee />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/orders/:id/edit" element={<OrderEdit />} />
        <Route path="/admin/order" element={<CreatOrder />} />
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
        <Route path="/add-vehicle" element={<Vehicle />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/customer/:id" element={<CostomerProfil />} />
        <Route path="/admin/customer/edit/:id" element={<EditCustomer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/Unauthorized" element={<Unauthorized />} />
        <Route path="/admin/employees" element={<Employees />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
