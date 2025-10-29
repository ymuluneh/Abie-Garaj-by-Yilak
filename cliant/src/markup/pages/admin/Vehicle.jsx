import React from 'react'
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import VehicleForm from '../../components/Admin/VehicleForm';

function Vehicle() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <VehicleForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicle