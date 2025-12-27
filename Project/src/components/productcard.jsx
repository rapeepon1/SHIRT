import { useState } from "react";
import "../css/productcard.css";

const ProductCard = ({ product, onAddToCart, onNavigate }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // size ไม่ซ้ำ
  const sizes = [...new Set(product.variants.map(v => v.size))];

  // color ไม่ซ้ำ ตาม size
  const colors = [
    ...new Set(
      product.variants
        .filter(v => v.size === selectedSize)
        .map(v => v.color)
    )
  ];

  // variant ที่เลือก
  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const hasVariant = Boolean(selectedVariant);
  const canAdd = hasVariant && selectedVariant.stock > 0;

  return (
    <div className="product-card">
      <div
        className="product-image-wrapper"
        onClick={() => onNavigate?.("product_detail", product)}
      >
        <img
          src={product.product_image}
          alt={product.product_name}
          className="product-image"
        />
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.product_name}</h3>

        {/* ===== Size Buttons ===== */}
        <div className="variant-group">
          <p className="variant-label">Size</p>
          <div className="variant-buttons">
            {sizes.map(size => (
              <button
                key={size}
                className={`variant-btn ${
                  selectedSize === size ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedSize(size);
                  setSelectedColor("");
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Color Buttons ===== */}
        <div className="variant-group">
          <p className="variant-label">Color</p>
          <div className="variant-buttons">
            {colors.length === 0 && (
              <span className="variant-hint">เลือก Size ก่อน</span>
            )}

            {colors.map(color => (
              <button
                key={color}
                className={`variant-btn ${
                  selectedColor === color ? "active" : ""
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Stock ===== */}
        {hasVariant ? (
          selectedVariant.stock > 0 ? (
            <p className="stock-text">
              คงเหลือ {selectedVariant.stock} ชิ้น
            </p>
          ) : (
            <p className="stock-text out-of-stock">
              สินค้าหมด
            </p>
          )
        ) : (
          <p className="stock-text hint">
            กรุณาเลือก Size และ Color
          </p>
        )}

        <div className="product-footer">
          <p className="product-price">
            {Number(product.product_price).toLocaleString()} THB
          </p>

          <button
            className="add-button"
            disabled={!canAdd}
            onClick={() => {
              if (!hasVariant) return;
              onAddToCart({
                product_id: product.product_id,
                product_detail_id: selectedVariant.product_detail_id,
                name: product.product_name,
                price: Number(product.product_price),
                image: product.product_image,
                size: selectedVariant.size,
                color: selectedVariant.color,
                quantity: 1
              });
            }}
          >
            {!hasVariant
              ? "เลือก Size/Color"
              : selectedVariant.stock === 0
              ? "สินค้าหมด"
              : "เพิ่ม"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
