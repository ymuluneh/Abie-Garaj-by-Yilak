import React from 'react'
import OrderDetails from "../../../components/OrderList/OrderDetail"
import AdminMenu from '../../../components/Admin/AdminMenu/AdminMenu';

function OrderDetail() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <OrderDetails />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail