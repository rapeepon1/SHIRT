import React from "react";
import NavItem from "../components/navitem";
import { useNavigate } from "react-router-dom";
import "../css/admin.css";

const SidebarAdmin = ( {currentPage} ) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div className="admin-sidebar">
      <div className="admin-title">ADMIN PANEL</div>
      <p className="admin-section-label">การจัดการ</p>

      <NavItem
        label="จัดการสินค้า"
        isActive={currentPage === "admin_product"}
        onClick={() => navigate("/admin_product/${id}")}
      />

      <NavItem
        label="จัดการคำสั่งซื้อ"
        isActive={currentPage === "admin_order"}
        onClick={() => navigate("/admin_order")}
      />

      <div className="lo  gout-wrapper">
        <NavItem
          label="ออกจากระบบ"
          className="logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default SidebarAdmin;
