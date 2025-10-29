import React from 'react'
import CreateOrder from '../../../components/OrderList/CreateOrder';
import AdminMenu from '../../../components/Admin/AdminMenu/AdminMenu';

function CreatOrder() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <CreateOrder />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatOrder