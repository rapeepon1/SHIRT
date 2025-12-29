import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard } from "lucide-react";
import { useAuth } from "../context/authcontext"
import { useCart } from "../context/cartcontext";
import "../css/checkout.css";

const Checkout = () => {
  const { token } = useAuth()
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState({ name: "", phone: "", detail: "" });
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          items: cart,
          total_amount: total,
          address,
          status: "รอดำเนินการ",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("สั่งซื้อสำเร็จ!");
        clearCart();
        navigate("/order");
      } else {
        alert("ข้อผิดพลาด: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="checkout-page">
      <button onClick={() => navigate("/cart")} className="back-btn">
        <ChevronLeft size={20} /> กลับไปที่ตะกร้า
      </button>

      <h2 className="checkout-title">
        <CreditCard size={24} /> เช็คเอาท์
      </h2>

      <div className="order-summary-card">
        <h3>สรุปรายการสั่งซื้อ</h3>
        {cart.map((item) => (
          <div
            key={item.product_detail_id || item.product_id}
            className="summary-item"
          >
            <span>

              {item.name || "สินค้า"} ({item.size || "-"}/{item.color || "-"}) x{" "}
              {item.quantity || 0}
            </span>
            <span>
              {(
                Number(item.price || 0) * Number(item.quantity || 0)
              ).toLocaleString()}{" "}
              THB
            </span>
          </div>
        ))}
        <hr className="summary-divider" />
        <div className="total-row">
          <span>ยอดรวมทั้งสิ้น:</span>
          <span className="total-price">
            {Number(total || 0).toLocaleString()} THB
          </span>
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="checkout-form">
        <h3>ที่อยู่จัดส่ง</h3>
        <input
          type="text"
          placeholder="ชื่อ-นามสกุล"
          required
          className="input-field"
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="เบอร์โทรศัพท์"
          required
          className="input-field"
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />
        <textarea
          placeholder="ที่อยู่โดยละเอียด..."
          required
          rows="3"
          className="input-field"
          onChange={(e) => setAddress({ ...address, detail: e.target.value })}
        ></textarea>
        <button type="submit" className="btn-confirm">
          ยืนยันการสั่งซื้อ
        </button>
      </form>
    </div>
  );
};

export default Checkout;
