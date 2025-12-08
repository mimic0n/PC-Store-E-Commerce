import React from 'react'
import './CartPage.css'
import { Link, useNavigate } from 'react-router-dom';

import { RiDeleteBin6Fill } from "react-icons/ri";
import { AiFillLock } from "react-icons/ai";
import { GiReturnArrow } from "react-icons/gi";
import { FaCcMastercard } from "react-icons/fa6";
import { useCart } from '../../context/CartContext'; 

export const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    cartTotal, 
    loading, 
    updateQuantity, 
    removeItem,
    // NEW: Import các functions mới
    selectedItems,
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    isItemSelected,
    calculateSelectedTotal,
    setItemsForCheckout
  } = useCart();

  const [showPromoCode, setShowPromoCode] = React.useState(false);

  const handleUpdateQuantity = async (itemId, delta) => {
    const item = cartItems.find(i => (i.id || i.productId) === itemId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity >= 1) {
        await updateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
  };

  // NEW: Tính toán dựa trên items được chọn
  const selectedTotal = calculateSelectedTotal();
  const hasSelectedItems = selectedItems.length > 0;
  const subtotal = hasSelectedItems ? selectedTotal : cartTotal;
  const shipping = 30000;
  const total = subtotal + shipping;

  // NEW: Kiểm tra tất cả đã được chọn chưa
  const isAllSelected = cartItems.length > 0 && 
    cartItems.every(item => selectedItems.includes(item.id || item.productId));

  // NEW: Handle toggle all
  const handleToggleAll = () => {
    if (isAllSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  // NEW: Handle checkout với selected items
  const handleCheckout = () => {
    if (hasSelectedItems) {
      setItemsForCheckout();
      navigate('/CheckOut');
    } else {
      // Nếu không chọn gì, checkout tất cả
      setItemsForCheckout();
      navigate('/CheckOut');
    }
  };

  // NEW: Handle Buy Now cho 1 item
  const handleBuyNow = (item) => {
    const itemsToCheckout = [item];
    setItemsForCheckout(itemsToCheckout);
    navigate('/CheckOut');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <section className='cart-page-section'>
        <div className='cart-page-container'>
          <div className='cart-page-empty'>
            <div className='cart-page-empty-icon'>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="50" stroke="url(#gradient)" strokeWidth="2"/>
                <path d="M40 55 L50 65 L80 35" stroke="#00fff9" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b24bf3"/>
                    <stop offset="100%" stopColor="#00fff9"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className='cart-page-empty-title'>Your Cart is Empty</h2>
            <p className='cart-page-empty-text'>Add products to experience future technology</p>
            <Link to="/ProductListing">
              <button className='cart-page-empty-btn'>
                <span>Explore Now</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='cart-page-section'>
      <div className='cart-page-container'>
        <div className='cart-page-left'>
          <div className='cart-page-header'>
            <h2 className='cart-page-title'>Your Shopping Cart</h2>
            <p className='cart-page-count'>
              You have <span className='cart-page-count-number'>{cartItems.length}</span> {cartItems.length > 1 ? 'items' : 'item'} in your cart
              {hasSelectedItems && (
                <span className='cart-page-selected-count'>
                  {' '}• {selectedItems.length} selected
                </span>
              )}
            </p>
          </div>

          {/* NEW: Select All Checkbox */}
          <div className='cart-page-select-all'>
            <label className='cart-page-checkbox-label'>
              <input 
                type='checkbox' 
                checked={isAllSelected}
                onChange={handleToggleAll}
                className='cart-page-checkbox'
              />
              <span className='cart-page-checkbox-custom'></span>
              <span>Select All ({cartItems.length} items)</span>
            </label>
          </div>

          <div className='cart-page-list'>
            {cartItems.map((item) => {
              const product = item.product || item;
              const itemPrice = product.salePrice || product.price || item.price;
              const itemId = item.id || item.productId;
              const isSelected = isItemSelected(itemId);
              
              return (
                <div key={itemId} className={`cart-page-item ${isSelected ? 'selected' : ''}`}>
                  {/* NEW: Checkbox cho mỗi item */}
                  <div className='cart-page-item-checkbox'>
                    <label className='cart-page-checkbox-label'>
                      <input 
                        type='checkbox' 
                        checked={isSelected}
                        onChange={() => toggleSelectItem(itemId)}
                        className='cart-page-checkbox'
                      />
                      <span className='cart-page-checkbox-custom'></span>
                    </label>
                  </div>

                  <div className='cart-page-item-image'>
                    <img 
                      src={product.thumbnail || '/src/assets/placeholder.jpg'} 
                      alt={product.name} 
                      className='cart-page-item-img' 
                    />
                    <div className='cart-page-item-overlay'></div>
                  </div>
                  
                  <div className='cart-page-item-details'>
                    <div className='cart-page-item-name'>{product.name}</div>
                    <div className='cart-page-item-attributes'>
                    </div>
                    <p className='cart-page-item-price'>
                      <span className='cart-page-item-price-title'>Price:</span>
                      {formatPrice(itemPrice)}
                    </p>
                  </div>

                  <div className='cart-page-item-actions'>
                    <div className='cart-page-quantity'>
                      <button 
                        className='cart-page-quantity-btn' 
                        onClick={() => handleUpdateQuantity(itemId, -1)}
                        disabled={item.quantity <= 1 || loading}
                      >
                        <span>−</span>
                      </button>
                      <span className='cart-page-quantity-display'>{item.quantity}</span>
                      <button 
                        className='cart-page-quantity-btn' 
                        onClick={() => handleUpdateQuantity(itemId, 1)}
                        disabled={loading}
                      >
                        <span>+</span>
                      </button>
                    </div>
                    
                    {/* NEW: Buy Now button cho từng item */}
                    <button 
                      className='cart-page-buy-now-btn' 
                      onClick={() => handleBuyNow(item)}
                      title='Buy Now'
                      disabled={loading}
                    >
                      Buy Now
                    </button>

                    <button 
                      className='cart-page-remove-btn' 
                      onClick={() => handleRemoveItem(itemId)}
                      title='Remove Product'
                      disabled={loading}
                    >
                      <RiDeleteBin6Fill />
                    </button>
                  </div>

                  <div className='cart-page-item-total'>
                    <span className='cart-page-item-total-label'>Total:</span>
                    <span className='cart-page-item-total-price'>{formatPrice(itemPrice * item.quantity)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link to="/ProductListing">
            <button className='cart-page-continue-btn'>
              <span>← Continue Shopping</span>
            </button>
          </Link>
        </div>

        <div className='cart-page-right'>
          <div className='cart-page-summary'>
            <div className='cart-page-summary-title'>
              <h3>Order Summary</h3>
              {hasSelectedItems && (
                <span className='cart-page-summary-selected'>
                  ({selectedItems.length} items selected)
                </span>
              )}
            </div>
            <div className='cart-page-summary-row'>
              <span className='cart-page-summary-label'>Subtotal:</span>
              <span className='cart-page-summary-value'>{formatPrice(subtotal)}</span>
            </div>
            
            <div className='cart-page-summary-row'>
              <span className='cart-page-summary-label'>Shipping Fee:</span>
              <span className='cart-page-summary-value'>{formatPrice(shipping)}</span>
            </div>

            <div className='cart-page-promo'>
              {!showPromoCode ? (
                <button 
                  className='cart-page-promo-toggle' 
                  onClick={() => setShowPromoCode(true)}
                >
                  Have a promo code?
                </button>
              ) : (
                <div className='cart-page-promo-wrapper'>
                  <input 
                    type='text' 
                    placeholder='Enter promo code'
                    className='cart-page-promo-input'
                  />
                  <button className='cart-page-promo-apply'>Apply</button>
                </div>
              )}
            </div>

            <div className='cart-page-summary-divider'></div>

            <div className='cart-page-summary-total'>
              <span className='cart-page-summary-total-amount'>{formatPrice(total)}</span>
            </div>

            <button 
              className='cart-page-checkout-btn'
              onClick={handleCheckout}
              disabled={loading}
            >
              <span>
                {hasSelectedItems 
                  ? `CHECKOUT (${selectedItems.length} items)` 
                  : 'CHECKOUT ALL'
                }
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className='cart-page-trust'>
              <div className='cart-page-trust-item'>
                <span className='cart-page-trust-icon'><AiFillLock /></span>
                <span className='cart-page-trust-text'>SSL Secure</span>
              </div>
              <div className='cart-page-trust-item'>
                <span className='cart-page-trust-icon'><FaCcMastercard /></span>
                <span className='cart-page-trust-text'>Visa/Mastercard</span>
              </div>
              <div className='cart-page-trust-item'>
                <span className='cart-page-trust-icon'><GiReturnArrow/></span>
                <span className='cart-page-trust-text'>30-Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='cart-page-mobile-bar'>
        <div className='cart-page-mobile-total'>
          <span className='cart-page-mobile-label'>
            Total {hasSelectedItems ? `(${selectedItems.length})` : ''}:
          </span>
          <span className='cart-page-mobile-amount'>{formatPrice(total)}</span>
        </div>
        <button 
          className='cart-page-mobile-checkout'
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </section>
  )
}

export default CartPage