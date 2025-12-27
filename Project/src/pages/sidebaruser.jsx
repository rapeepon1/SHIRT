import React from "react";
import { useNavigate } from "react-router-dom";
import NavItem from "../components/navitem";
import "../css/user.css";

const SidebarUser = ({ currentPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div className="sidebar-user">
      <div className="account-section">USER PANEL</div>
      <p className="account-label">USER</p>

      <NavItem
        label="สินค้า"
        isActive={currentPage === "product"}
        onClick={() => navigate("/product")}
        className="nav-item-custom"
      />

      <NavItem
        label="ติดตามคำสั่งซื้อ"
        isActive={currentPage === "order"}
        onClick={() => navigate("/order")}
        className="nav-item-custom"
      />
      <div className="logout-wrapper">
        <NavItem
          label="ออกจากระบบ"
          isActive={false}
          onClick={() => navigate("/")}
          className="nav-item-custom"
        />
      </div>
    </div>
  );
};

export default SidebarUser;
