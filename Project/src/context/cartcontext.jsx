import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_detail_id === product.product_detail_id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product_detail_id === product.product_detail_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          product_id: product.product_id,
          product_detail_id: product.product_detail_id,
          name: product.name,
          price: Number(product.price),
          image: product.image || null, // กัน src=""
          size: product.size,
          color: product.color,
          quantity: 1,
        },
      ];
    });

    alert("เพิ่มสินค้าเรียบร้อย!");
  };

  // ✅ ลบตาม product_detail_id
  const removeItem = (product_detail_id) => {
    setCart((prev) =>
      prev.filter((item) => item.product_detail_id !== product_detail_id)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
