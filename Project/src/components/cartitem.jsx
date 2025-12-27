import React from 'react'
import { Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity = () => {}, onRemove = () => {} }) => (
  <div className="cart-item">
    <div className="cart-item-left">
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="item-info">
        <h4>{item.name}</h4>
        <p>สี: {item.color}, ขนาด: {item.size}</p>
      </div>
    </div>

    <p className="item-price">{item.price.toLocaleString()}</p>

    <div className="item-qty">
      <input
        type="number"
        value={item.quantity}
        className="qty-input"
        readOnly
      />
    </div>

    <p className="item-total">{(item.price * item.quantity).toLocaleString()}</p>

    <button type="button" onClick={onRemove} className="item-remove-btn" aria-label="ลบสินค้านี้">
      <Trash2 size={20} color="#ef4444" />
    </button>
  </div>
);


export default CartItem
