import React from 'react'
import ServiceManagement from './ServiceManagement';
import AdminMenu from '../../../components/Admin/AdminMenu/AdminMenu';

function Services() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu/>
          </div>
          <div className="col-md-9 admin-right-side">
            <ServiceManagement />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;