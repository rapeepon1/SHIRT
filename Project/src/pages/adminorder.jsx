import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ChevronLeft, Eye, X } from "lucide-react"; // เพิ่ม Eye และ X
import "../css/adminorder.css";

const AdminOrder = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State สำหรับ Modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/order");
        const data = await response.json();
        setAllOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("ไม่สามารถเชื่อมต่อ SERVER", err.message);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (order_id, status) => {
    await fetch(`http://localhost:3000/order/${order_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setAllOrders((prev) =>
      prev.map((o) => (o.order_id === order_id ? { ...o, status } : o))
    );
  };

  return (
    <div className="admin-container">
      <button
        onClick={() => navigate("/admin_product")}
        className="back-button"
      >
        <ChevronLeft size={20} /> กลับหน้าหลัก Admin
      </button>

      <h2 className="header-title">
        <ClipboardList size={24} /> จัดการสถานะคำสั่งซื้อ
      </h2>

      <table className="order-table">
        <thead>
          <tr>
            <th>เลขที่คำสั่งซื้อ</th>
            <th>วันที่สั่งซื้อ</th> {/* เพิ่มคอลัมน์วันที่ */}
            <th>ผู้สั่งซื้อ</th>
            <th>ยอดรวม</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order, num) => (
            <tr key={num}>
              <td>#ORDER--{order.order_id}</td>
              <td>{new Date(order.order_date).toLocaleString("th-TH")}</td>{" "}
              {/* แสดงวันเวลา */}
              <td>{order.ship_name || "ไม่ระบุชื่อ"}</td>
              <td>{Number(order.total_amount).toLocaleString()} THB</td>
              <td>
                <span
                  className={`status-badge ${
                    order.status === "จัดส่งแล้ว"
                      ? "status-shipped"
                      : "status-pending"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="action-cells">
                <button
                  className="btn-view"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
                <select
                  onChange={(e) => updateStatus(order.order_id, e.target.value)}
                  defaultValue={order.status}
                  className="status-select"
                >
                  <option value="รอดำเนินการ">รอดำเนินการ</option>
                  <option value="กำลังเตรียมจัดส่ง">กำลังเตรียมจัดส่ง</option>
                  <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal สำหรับ Admin ดูรายละเอียดสินค้า */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                รายละเอียดออเดอร์ #{selectedOrder.order_id}
              </h3>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-info-section">
                <p>
                  <strong>ผู้สั่งซื้อ:</strong> {selectedOrder.ship_name}
                </p>
                <p>
                  <strong>เบอร์โทร:</strong> {selectedOrder.ship_phone}
                </p>
                <p>
                  <strong>ที่อยู่:</strong> {selectedOrder.ship_address}
                </p>
                <p>
                  <strong>เวลาที่สั่ง:</strong>{" "}
                  {new Date(selectedOrder.order_date).toLocaleString("th-TH")}
                </p>
              </div>

              <div className="order-items-divider"></div>

              <h4 className="section-subtitle">รายการสินค้า</h4>
              <div className="order-items-container">
                {selectedOrder.items && selectedOrder.items[0].name !== null ? (
                  selectedOrder.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span className="item-name-qty">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="item-price">
                        {(item.price * item.quantity).toLocaleString()} THB
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-items-text">ไม่มีข้อมูลสินค้า</p>
                )}
              </div>

              <div className="order-items-divider"></div>

              <div className="modal-summary-total">
                <span className="summary-label">ยอดรวมสุทธิ:</span>
                <span className="summary-value">
                  {Number(selectedOrder.total_amount).toLocaleString()} THB
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
