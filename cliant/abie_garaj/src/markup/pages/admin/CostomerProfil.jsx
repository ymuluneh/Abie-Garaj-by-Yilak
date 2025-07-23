import React from "react";
import { useParams } from "react-router-dom";
import CustomerProfilePage from "../../components/Admin/CustomerProfilePage";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";

function CostomerProfil() {
  const { id } = useParams(); // ✅ Extract customerId from URL

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          {/* ✅ Pass it to profile page */}
          <CustomerProfilePage customerId={id} />
        </div>
      </div>
    </div>
  );
}

export default CostomerProfil;
