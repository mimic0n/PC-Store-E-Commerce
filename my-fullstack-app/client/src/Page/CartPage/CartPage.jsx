import React, { useState } from 'react'
import './CartPage.css'

import { RiDeleteBin6Fill } from "react-icons/ri";
import { AiFillLock } from "react-icons/ai";
import { GiReturnArrow } from "react-icons/gi";
import { FaCcMastercard } from "react-icons/fa6";
import { FaGifts } from "react-icons/fa";

export const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC',
      image: '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg',
      price: 48880000,
      quantity: 1,
    },
    {
      id: 2,
      name: 'PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC',
      image: '/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg',
      price: 48880000,
      quantity: 1,
    }
  ])

  const [showPromoCode, setShowPromoCode] = useState(false)

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 30000
  const total = subtotal + shipping

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code'
    }).format(price);
  }

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
            <button className='cart-page-empty-btn'>
              <span>Explore Now</span>
            </button>
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
            </p>
          </div>

          <div className='cart-page-list'>
            {cartItems.map((item) => (
              <div key={item.id} className='cart-page-item'>
                <div className='cart-page-item-image'>
                  <img src={item.image} alt={item.name} className='cart-page-item-img' />
                  <div className='cart-page-item-overlay'></div>
                </div>
                
                <div className='cart-page-item-details'>
                  <div className='cart-page-item-name'>{item.name}</div>
                  <div className='cart-page-item-attributes'>
                  </div>
                  <p className='cart-page-item-price'>
                    <span className='cart-page-item-price-title'>Price:</span>
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className='cart-page-item-actions'>
                  <div className='cart-page-quantity'>
                    <button 
                      className='cart-page-quantity-btn' 
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <span>−</span>
                    </button>
                    <span className='cart-page-quantity-display'>{item.quantity}</span>
                    <button 
                      className='cart-page-quantity-btn' 
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <span>+</span>
                    </button>
                  </div>
                  
                  <button 
                    className='cart-page-remove-btn' 
                    onClick={() => removeItem(item.id)}
                    title='Remove Product'
                  >
                    <RiDeleteBin6Fill />
                  </button>
                </div>

                <div className='cart-page-item-total'>
                  <span className='cart-page-item-total-label'>Total:</span>
                  <span className='cart-page-item-total-price'>{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <button className='cart-page-continue-btn'>
            <span>← Continue Shopping</span>
          </button>
        </div>

        <div className='cart-page-right'>
          <div className='cart-page-summary'>
            <div className='cart-page-summary-title'>
              <h3 >Order Summary</h3>
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

            <button className='cart-page-checkout-btn'>
              <span>CHECKOUT</span>
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
          <span className='cart-page-mobile-label'>Total:</span>
          <span className='cart-page-mobile-amount'>{formatPrice(total)}</span>
        </div>
        <button className='cart-page-mobile-checkout'>
          Checkout
        </button>
      </div>
    </section>
  )
}

export default CartPage