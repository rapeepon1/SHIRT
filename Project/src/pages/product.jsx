import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/productcard";
import { useCart } from "../context/cartcontext"; 
import "../css/product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/product");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("ไม่สามารถเชื่อมต่อ SERVER", err.message);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-page-container">
      <div className="product-page-header">
        <h1>รายการสินค้า</h1>
        <div className="search-section">
          <input
            placeholder="ค้นหาชื่อสินค้า..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="product-count-text">
            สินค้าทั้งหมด <span>{filteredProducts.length}</span> รายการ
          </p>
        </div>
        <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
          <ShoppingCart size={28} />
        </div>
      </div>

      <div className="products-grid-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductCard
              key={item.product_id}
              product={item}
              onAddToCart={addToCart}
            />
          ))
        ) : (
          <div className="no-products">
            <p>ไม่พบสินค้า</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
