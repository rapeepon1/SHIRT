import React, { useState, useEffect } from "react";
import { useCart } from "../context/cartcontext";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/cart.css";

const Cart = () => {
  const { cart, removeItem } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="cart-page">
      <button onClick={() => navigate("/product")} className="back-link">
        <ArrowLeft size={18} /> กลับไปเลือกสินค้า
      </button>

      <h2>ตะกร้าของคุณ ({cart.length} รายการ)</h2>

      <div className="cart-list">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.product_detail_id} className="cart-item-row">
              <img
                src={item.image}
                className="cart-item-image"
                alt={item.name}
              />

              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">
                  {Number(item.price).toLocaleString()} THB
                </span>
              </div>

              <span className="cart-item-qty">จำนวน: {item.quantity}</span>

              <button
                className="btn-remove"
                onClick={() => removeItem(item.product_detail_id)}
              >
                <Trash2 size={18} color="#ef4444" />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-cart-msg">ยังไม่มีสินค้าในตะกร้า</div>
        )}
      </div>

      <div className="summary">
        <h3>ยอดรวม: {total.toLocaleString()} THB</h3>
        <button
          className="btn-checkout"
          onClick={() => {
            if (cart.length > 0) {
              navigate("/checkout");
            } else {
              alert("กรุณาเลือกสินค้า");
            }
          }}
        >
          สั่งซื้อสินค้า
        </button>
      </div>
    </div>
  );
};

export default Cart;
