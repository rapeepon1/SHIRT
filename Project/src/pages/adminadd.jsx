// pages/adminaddproduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import "../css/adminproduct.css";

const AdminAdd = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_name: "",
    product_price: "",
    product_image: ""
  });

  const [variants, setVariants] = useState([
    { size: "", color: "", stock: 0 }
  ]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 0 }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          variants
        }),
      });

      if (response.ok) {
        alert("เพิ่มสินค้าสำเร็จ!");
        navigate("/admin_product/${id}");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="admin-edit-container">
      <button onClick={() => navigate("/admin_product")} className="back-link">
        <ChevronLeft size={20} /> กลับไปหน้ารายการ
      </button>

      <h2>เพิ่มสินค้าใหม่</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        {/* ===== product ===== */}
        <div className="form-group">
          <label>ชื่อสินค้า</label>
          <input
            className="form-input"
            required
            value={product.product_name}
            onChange={(e) =>
              setProduct({ ...product, product_name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>ราคา</label>
          <input
            type="number"
            className="form-input"
            required
            value={product.product_price}
            onChange={(e) =>
              setProduct({ ...product, product_price: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>URL รูปภาพ</label>
          <input
            className="form-input"
            value={product.product_image}
            onChange={(e) =>
              setProduct({ ...product, product_image: e.target.value })
            }
          />
        </div>

        {/* ===== variants ===== */}
        <h3>Size / Color / Stock</h3>

        {variants.map((v, index) => (
          <div key={index} className="variant-row">
            <input
              placeholder="Size"
              value={v.size}
              onChange={(e) =>
                handleVariantChange(index, "size", e.target.value)
              }
            />
            <input
              placeholder="Color"
              value={v.color}
              onChange={(e) =>
                handleVariantChange(index, "color", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                handleVariantChange(index, "stock", e.target.value)
              }
            />

            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addVariant}>
          <Plus size={16} /> เพิ่ม Size / Color
        </button>

        <button type="submit" className="btn-save">
          <Save size={18} /> บันทึกสินค้า
        </button>
      </form>
    </div>
  );
};

export default AdminAdd;
