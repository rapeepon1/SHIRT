import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import SidebarAdmin from "./pages/sidebaradmin";
import SidebarUser from "./pages/sidebaruser";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Order from "./pages/order";
import Checkout from "./pages/checkout";
import AdminOrder from "./pages/adminorder";
import AdminProduct from "./pages/adminproduct";
import AdminEdit from "./pages/adminedit"
import AdminAdd from "./pages/adminadd";
import { CartProvider } from "./context/cartcontext";
import { AuthProvider } from './context/authcontext';
import "./App.css";

function App() {
  const location = useLocation();

  const showUserSidebar = ["/product", "/cart", "/order", "/checkout"].includes(
    location.pathname
  );
  const showAdminSidebar = location.pathname.startsWith("/admin");

  return (
    <>
      {showAdminSidebar && <SidebarAdmin />}
      {showUserSidebar && <SidebarUser />}

      <main
        className={
          showAdminSidebar || showUserSidebar
            ? "main-content with-sidebar"
            : "main-content"
        }
      >
        <AuthProvider>
        <CartProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin_order" element={<AdminOrder />} />
          <Route path="/admin_product/:id" element={<AdminProduct />} />
          <Route path="/admin_edit/:id" element={<AdminEdit />} />
          <Route path="/admin_add" element={<AdminAdd />} />

          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        </CartProvider>
        </AuthProvider>
      </main>
    </>
  );
}

export default App;
