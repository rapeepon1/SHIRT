import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Plus } from "lucide-react";
import "../css/adminproduct.css";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/product");
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("SERVER ERROR", err.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="admin-container">
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>จัดการสินค้า</h2>
        <button
          className="btn-save"
          style={{ width: "auto" }}
          onClick={() => navigate("/admin_add")}
        >
          <Plus size={18} /> เพิ่มสินค้า
        </button>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อสินค้า</th>
            <th>ตัวเลือก (Size / Color / Stock)</th>
            <th>ราคา</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.product_id}>
              <td>#{item.product_id}</td>

              <td>
                <strong>{item.product_name}</strong>
              </td>

              <td>
                {item.variants && item.variants.length > 0 ? (
                  <ul style={{ paddingLeft: "16px", margin: 0 }}>
                    {item.variants.map((v) => (
                      <li key={v.product_detail_id}>
                        {v.size} / {v.color} —{" "}
                        {v.stock > 0 ? (
                          <span style={{ color: "green" }}>
                            คงเหลือ {v.stock}
                          </span>
                        ) : (
                          <span style={{ color: "red" }}>สินค้าหมด</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: "gray" }}>
                    ยังไม่มี size / color
                  </span>
                )}
              </td>

              <td>{Number(item.product_price).toLocaleString()} THB</td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/admin_edit/${item.product_id}`)
                  }
                >
                  <Edit2 size={18} /> แก้ไข
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduct;
