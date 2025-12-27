import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import "../css/adminproduct.css";

const AdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_name: "",
    product_price: "",
    product_image: ""
  });

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/product/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          product_name: data.product_name,
          product_price: data.product_price,
          product_image: data.product_image
        });
        setVariants(data.variants || []);
      });
  }, [id]);

  const handleVariantChange = (i, field, value) => {
    const copy = [...variants];
    copy[i][field] = value;
    setVariants(copy);
  };

  const addVariant = () =>
    setVariants([...variants, { size: "", color: "", stock: 0 }]);

  const removeVariant = (i) =>
    setVariants(variants.filter((_, index) => index !== i));

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    product_name: product.product_name,
    product_price: Number(product.product_price),
    product_image: product.product_image || null,
    variants: variants.map(v => ({
      size: v.size,
      color: v.color,
      stock: Number(v.stock),
    })),
  };

  const res = await fetch(`http://localhost:3000/product/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  alert("อัปเดตเรียบร้อย");
  navigate("/admin_product/${id}")
};


  return (
    <div className="admin-edit-container">
      <button onClick={() => navigate("/admin_product")} className="back-link">
        <ChevronLeft size={20} /> กลับ
      </button>

      <h2>แก้ไขสินค้า #{id}</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        <input
          placeholder="ชื่อสินค้า"
          value={product.product_name}
          onChange={e => setProduct({ ...product, product_name: e.target.value })}
        />
        <input
          type="number"
          placeholder="ราคา"
          value={product.product_price}
          onChange={e => setProduct({ ...product, product_price: e.target.value })}
        />
        <input
          placeholder="รูปสินค้า"
          value={product.product_image}
          onChange={e => setProduct({ ...product, product_image: e.target.value })}
        />

        <h3>Size / Color / Stock</h3>

        {variants.map((v, i) => (
          <div key={i} className="variant-row">
            <input
              placeholder="Size"
              value={v.size}
              onChange={e => handleVariantChange(i, "size", e.target.value)}
            />
            <input
              placeholder="Color"
              value={v.color}
              onChange={e => handleVariantChange(i, "color", e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={e => handleVariantChange(i, "stock", e.target.value)}
            />
            <button type="button" onClick={() => removeVariant(i)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button type="button" onClick={addVariant}>
          <Plus size={16} /> เพิ่ม Size / Color
        </button>

        <button type="submit" className="btn-save">
          <Save size={18} /> บันทึก
        </button>
      </form>
    </div>
  );
};

export default AdminEdit;
