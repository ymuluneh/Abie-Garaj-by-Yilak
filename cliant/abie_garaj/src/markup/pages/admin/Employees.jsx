import React from "react";
// Import the auth hook
import { useAuth } from "../../../contexts/AuthContext";
// Import the login form component
import LoginForm from "../../components/LoginForm/LoginForm";
// Import the admin menu component
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
// Import the EmployeesList component
import EmployeesList from "../../components/Admin/EmployeesList/EmployeesList";
function Employees() {
 
    // console.log("Kebede");
      return (
        <div>
          <div className="container-fluid admin-pages">
            <div className="row">
              <div className="col-md-3 admin-left-side">
                <AdminMenu />
              </div>
              <div className="col-md-9 admin-right-side">
                <EmployeesList />
              </div>
            </div>
          </div>
        </div>
      );
    
  }


export default Employees;
