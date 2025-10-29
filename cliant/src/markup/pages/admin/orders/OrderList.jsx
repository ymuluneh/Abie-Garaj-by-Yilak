import React from 'react'
import AdminMenu from '../../../components/Admin/AdminMenu/AdminMenu'
import Orderlits from '../../../components/OrderList/OrderList'

function OrderList() {
  return (
   <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <Orderlits />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderList