import React from 'react'
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import CustomersPage from '../../components/Admin/CustomersPage';

function CustomerList() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <CustomersPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerList