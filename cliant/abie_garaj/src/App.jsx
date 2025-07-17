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

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/add-employee" element={<AddEmployee />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
