import React, { useState, useEffect } from "react";
import { Package, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext"
import "../css/order.css";

const Order = () => {
  const { token } = useAuth()
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchOrders = async () => {
  // ตรวจ
    if (!token) return; 

    try {
      const response = await fetch("http://localhost:3000/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ไม่สามารถเชื่อมต่อ SERVER", err.message);
    }
  };
  fetchOrders();
}, [token]);

  return (
    <div className="order-page">
      <button onClick={() => navigate("/product")} className="back-to-products">
        <ChevronLeft size={20} /> กลับไปหน้าสินค้า
      </button>

      <h1 className="order-header">
        <Package size={32} /> รายการคำสั่งซื้อของคุณ
      </h1>

      <div className="order-list">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="order-card"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="order-card-header">
              <span className="order-id">#ORDER--{order.order_id}</span>
              <span className="order-status">{order.status}</span>
            </div>
            <div className="order-summary-info">
              <p>
                วันที่: {new Date(order.order_date).toLocaleString("th-TH")}
              </p>
              <p>ยอดรวม: {Number(order.total_amount).toLocaleString()} THB</p>
            </div>
            <button className="btn-view-detail">ดูรายละเอียดสินค้า</button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>รายละเอียดคำสั่งซื้อ #{selectedOrder.order_id}</h3>
              <button
                className="close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                <strong>ผู้สั่งซื้อ:</strong> {selectedOrder.ship_name}
              </p>
              <p>
                <strong>เบอร์โทรศัพท์:</strong> {selectedOrder.ship_phone}
              </p>
              <p>
                <strong>ที่อยู่จัดส่ง:</strong> {selectedOrder.ship_address}
              </p>
              <p>
                <strong>วันที่สั่งซื้อ:</strong>{" "}
                {new Date(selectedOrder.order_date).toLocaleString("th-TH")}
              </p>

              <hr />
              <h4>รายการสินค้า</h4>
              <div className="order-items-list">
                {selectedOrder.items && selectedOrder.items[0].name !== null ? (
                  selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString()} THB
                      </span>
                    </div>
                  ))
                ) : (
                  <p>ไม่มีข้อมูลสินค้า</p>
                )}
              </div>
              <hr />
              <div className="order-modal-total">
                <strong>ยอดรวมสุทธิ:</strong>
                <span>
                  {Number(selectedOrder.total_amount).toLocaleString()} THB
                </span>
              </div>
            </div>
            <button
              className="btn-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
