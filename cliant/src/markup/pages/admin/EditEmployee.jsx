import React from 'react'
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import EmployeeEdit from "../../components/Admin/EmployeesList/EmployeeEdit";

function EditEmployee() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <EmployeeEdit />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee