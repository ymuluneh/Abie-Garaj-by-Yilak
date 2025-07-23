import React from 'react'
import EditCustomerPage from '../../components/Admin/EditCustomerPage';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';

function EditCustomer() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <EditCustomerPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCustomer