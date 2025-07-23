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
import Contact from "./markup/pages/Contact"
import AddCustemer from "./markup/pages/admin/AddCustemer";
import CustomersPage from "./markup/pages/admin/CustomerList";
import CustomerProfilePage from "./markup/components/Admin/CustomerProfilePage";
import EditCustomer from "./markup/pages/admin/EditCustomer";
import Vehicle from "./markup/pages/admin/Vehicle"


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
        <Route path="/add-vehicle" element={<Vehicle />} />

        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/customer/:id" element={<CustomerProfilePage />} />
        <Route path="/customer/edit/:id" element={<EditCustomer />} />
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
